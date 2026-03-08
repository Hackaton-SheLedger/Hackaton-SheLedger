import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json()

    if (!to || !message) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return NextResponse.json({ error: 'Twilio no configurado' }, { status: 500 })
    }

    const cleanTo = to.replace(/[\s\-\(\)]/g, '')
    const toNumber = cleanTo.startsWith('whatsapp:') ? cleanTo : `whatsapp:${cleanTo}`
    const fromNumber = 'whatsapp:+14155238886'

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          To: toNumber,
          From: fromNumber,
          Body: message,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Twilio error:', errorText)
      return NextResponse.json({ error: 'Error al enviar' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
