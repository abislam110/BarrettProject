import { NextResponse } from 'next/server'
import { deletePin } from '@/lib/pins'

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deleted = await deletePin(id)
  if (!deleted) return NextResponse.json({ error: 'Pin not found' }, { status: 404 })
  return new NextResponse(null, { status: 204 })
}
