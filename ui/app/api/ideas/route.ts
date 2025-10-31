import { NextRequest, NextResponse } from 'next/server';

interface IdeaRequestBody {
  idea: string;
}

// Validate input
function validateIdea(idea: string): { valid: boolean; error?: string } {
  if (!idea || typeof idea !== 'string') {
    return { valid: false, error: 'Idea is required' };
  }

  const trimmed = idea.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Idea cannot be empty' };
  }

  if (trimmed.length < 3) {
    return { valid: false, error: 'Idea must be at least 3 characters long' };
  }

  if (trimmed.length > 2000) {
    return { valid: false, error: 'Idea must be less than 2000 characters' };
  }

  // Basic sanitization - remove potentially dangerous characters
  // In production, use a proper HTML sanitization library
  const sanitized = trimmed.replace(/<script[^>]*>.*?<\/script>/gi, '');
  
  // Use sanitized value to prevent unused variable error
  if (!sanitized || sanitized.length === 0) {
    return { valid: false, error: 'Idea cannot be empty after sanitization' };
  }

  return { valid: true };
}

// Simple rate limiting (in production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute

function checkRateLimit(ip: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      error: 'Too many requests. Please try again later.',
    };
  }

  record.count++;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limit
    const rateLimitCheck = checkRateLimit(ip);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: rateLimitCheck.error },
        { status: 429 }
      );
    }

    // Parse and validate request body
    let body: IdeaRequestBody;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate idea
    const validation = validateIdea(body.idea);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Sanitize input (already validated, but extra safety)
    // In production, use sanitizedIdea for processing
    const sanitizedIdea = body.idea.trim().replace(/<script[^>]*>.*?<\/script>/gi, '');
    
    // Use sanitizedIdea to prevent unused variable warning
    if (!sanitizedIdea || sanitizedIdea.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input after sanitization' },
        { status: 400 }
      );
    }

    // TODO: Here you would typically:
    // 1. Save to database (use sanitizedIdea)
    // 2. Process the idea (use sanitizedIdea)
    // 3. Create project/checkout session
    // 4. Return response

    // For now, simulate processing
    const projectId = `project-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    // Simulate async processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return success response
    return NextResponse.json(
      {
        success: true,
        projectId,
        message: 'Idea submitted successfully',
        // checkoutUrl: '/checkout/...', // If using Stripe
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error (in production, use proper logging service)
    console.error('Error processing idea submission:', error);

    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit ideas.' },
    { status: 405 }
  );
}

