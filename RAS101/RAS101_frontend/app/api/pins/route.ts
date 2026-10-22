import { NextResponse } from 'next/server'
import { createPin, listPins, parseNewPin } from '@/lib/pins'

export async function GET() {
  return NextResponse.json(await listPins())
}

export async function POST(request: Request) {
  let input
  try {
    input = parseNewPin(await request.json())
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request'
    return NextResponse.json({ error: message }, { status: 400 })
  }
  const pin = await createPin(input)
  return NextResponse.json(pin, { status: 201 })
}
