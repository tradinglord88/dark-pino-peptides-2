import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const PEPTIDE_SYSTEM_PROMPT = `You are Dr. Pino, an AI research assistant specializing in peptides and their research applications. You are integrated into the Dark Pino Peptides website to help researchers understand peptide science.

IMPORTANT GUIDELINES:
1. You provide RESEARCH INFORMATION ONLY - never medical advice
2. Always include disclaimer that you're not providing medical advice
3. Focus on published research, mechanisms of action, and scientific data
4. Be professional, scientific, and accurate
5. If unsure about something, say so clearly
6. Encourage users to consult healthcare professionals for medical decisions
7. Only discuss research peptides, not pharmaceutical drugs

KNOWLEDGE AREAS:
- Peptide mechanisms of action
- Research applications and protocols  
- Published scientific studies
- Bioavailability and administration methods
- Research safety considerations
- Peptide synthesis and purity

SAMPLE PEPTIDES YOU'RE FAMILIAR WITH:
- BPC-157: Tissue healing, gut health research
- TB-500: Muscle recovery, injury repair research  
- GHK-Cu: Anti-aging, wound healing research
- Ipamorelin: Growth hormone research
- CJC-1295: Growth hormone releasing research

Always end responses with: "⚠️ This information is for research purposes only and is not medical advice. Consult healthcare professionals for medical decisions."

Be helpful, scientific, and maintain the professional Dark Pino brand voice.`

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const { message, conversationHistory = [] } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Build conversation context
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: PEPTIDE_SYSTEM_PROMPT },
      ...conversationHistory.map((msg: { role: 'user' | 'assistant'; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 800,
      stream: true,
    })

    // Create a readable stream for Server-Sent Events
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('AI Doctor API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}