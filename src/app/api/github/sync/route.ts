import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GitHub Repository Configuration
const REPO_OWNER = 'yathur-hub';
const REPO_NAME = 'VBV-Rezert';
const BRANCH = 'main';

/**
 * Endpoint to sync files from the external GitHub repository
 * into the SourceDocument intake queue.
 */
export async function POST(request: Request) {
  try {
    const { branch = BRANCH } = await request.json().catch(() => ({}));

    // 1. Fetch Repository Tree from GitHub
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${branch}?recursive=1`;
    
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'VBV-Rezert-App'
    };
    
    // Add GitHub Token if present in environment
    if (process.env.GITHUB_PAT) {
      headers['Authorization'] = `token ${process.env.GITHUB_PAT}`;
    }

    const response = await fetch(apiUrl, { headers });
    
    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ error: 'Failed to fetch GitHub repository tree', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    const tree = data.tree as any[];

    // 2. Filter for relevant files (e.g., .pdf, .docx, .md)
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md'];
    const files = tree.filter(item => 
      item.type === 'blob' && 
      validExtensions.some(ext => item.path.toLowerCase().endsWith(ext))
    );

    let newCount = 0;
    let existingCount = 0;

    // 3. Sync to Database
    for (const file of files) {
      const filePath = file.path;
      const fileHash = file.sha;
      const filename = filePath.split('/').pop() || filePath;

      // Check if file already exists by path and hash
      const existingDoc = await prisma.sourceDocument.findFirst({
        where: {
          repository_source: `${REPO_OWNER}/${REPO_NAME}`,
          file_path: filePath,
        }
      });

      if (!existingDoc) {
        // Create new SourceDocument in PENDING state
        await prisma.sourceDocument.create({
          data: {
            filename: filename,
            source_name: 'GitHub Intake',
            type: 'SCHRIFTLICH', // default, can be determined via folder structure later
            repository_source: `${REPO_OWNER}/${REPO_NAME}`,
            branch: branch,
            file_path: filePath,
            import_status: 'PENDING',
            file_hash: fileHash,
            last_sync_date: new Date(),
          }
        });
        newCount++;
      } else if (existingDoc.file_hash !== fileHash) {
        // Update existing document if hash changed
        await prisma.sourceDocument.update({
          where: { document_id: existingDoc.document_id },
          data: {
            file_hash: fileHash,
            import_status: 'PENDING',
            last_sync_date: new Date(),
          }
        });
        newCount++;
      } else {
        existingCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync complete. ${newCount} new/updated files found. ${existingCount} existing files unchanged.`,
      stats: { new: newCount, existing: existingCount, totalFound: files.length }
    });

  } catch (error: any) {
    console.error('GitHub Sync Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
