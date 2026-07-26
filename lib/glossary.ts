export type GlossaryEntry = {
  term: string;
  full?: string;
  definition: string;
  domain?: number;
  exam: boolean;
};

export const GLOSSARY: readonly GlossaryEntry[] = [
  {
    "term": "ASR",
    "full": "Automatic Speech Recognition",
    "definition": "Technology that converts spoken language into text. Modern ASR systems use deep learning models (transformers, CTC, RNN-T) to transcribe audio in real time or from recordings.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "TTS",
    "full": "Text-to-Speech",
    "definition": "Converts written text into synthesized spoken audio. Neural TTS (transformer/diffusion-based) produces near-human naturalness, replacing older concatenative and formant methods.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "STT",
    "full": "Speech-to-Text",
    "definition": "Synonym for ASR. Converts audio input into written text output.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "WER",
    "full": "Word Error Rate",
    "definition": "Primary metric for ASR accuracy. Calculated as (Substitutions + Insertions + Deletions) / Total Reference Words. Lower is better. Domain-specific test sets (medical, legal) give more meaningful WER than generic benchmarks.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "MOS",
    "full": "Mean Opinion Score",
    "definition": "Subjective speech quality metric rated on a 1–5 scale by human listeners. Used to evaluate TTS naturalness, codec quality, and voice cloning fidelity. 4.0+ is considered high quality.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "RTF",
    "full": "Real-Time Factor",
    "definition": "Ratio of processing time to audio duration. An RTF of 0.5 means 1 second of audio is processed in 0.5 seconds. Must be < 1.0 for real-time applications.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "Speaker Diarization",
    "definition": "The process of identifying 'who spoke when' in a multi-speaker audio recording. Segments audio by speaker identity without necessarily identifying who the speakers are.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "Neural TTS",
    "definition": "Text-to-speech systems using deep neural networks (transformers, diffusion models, or autoregressive models) to generate highly natural-sounding speech. Examples include VALL-E, Tortoise TTS, and ElevenLabs.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "Concatenative Synthesis",
    "definition": "Older TTS approach that stitches together pre-recorded audio segments. Produces robotic-sounding speech at segment boundaries. Largely replaced by neural methods.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "Formant Synthesis",
    "definition": "Rule-based TTS that generates speech by modeling acoustic resonances (formants) of the vocal tract. Very fast and lightweight but sounds artificial.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "Voice Activity Detection",
    "full": "VAD",
    "definition": "Algorithm that detects whether a segment of audio contains human speech or silence/noise. Critical for turn-taking, endpointing, and reducing unnecessary ASR processing.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "Endpointing",
    "definition": "Detecting when a speaker has finished their utterance. Accurate endpointing prevents cutting off users mid-sentence and reduces awkward pauses in conversational AI.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "Phoneme",
    "definition": "The smallest unit of sound that distinguishes meaning in a language. ASR and TTS systems often use phoneme representations as intermediate features. English has roughly 44 phonemes.",
    "domain": 1,
    "exam": false
  },
  {
    "term": "Prosody",
    "definition": "The rhythm, stress, and intonation patterns of speech. Prosody carries emotional and contextual meaning beyond the words themselves. Advanced TTS systems model prosody explicitly.",
    "domain": 1,
    "exam": false
  },
  {
    "term": "Mel Spectrogram",
    "definition": "A visual representation of audio frequencies mapped to the mel scale (which approximates human hearing). Used as input features for most modern ASR and TTS models.",
    "domain": 1,
    "exam": false
  },
  {
    "term": "CTC",
    "full": "Connectionist Temporal Classification",
    "definition": "A loss function and decoding strategy used in ASR that allows models to output sequences without requiring precise alignment between audio frames and text labels.",
    "domain": 1,
    "exam": false
  },
  {
    "term": "RNN-T",
    "full": "Recurrent Neural Network Transducer",
    "definition": "An end-to-end ASR architecture that combines an encoder, prediction network, and joint network. Used in streaming ASR systems like those from Google.",
    "domain": 1,
    "exam": false
  },
  {
    "term": "Voice Cloning",
    "definition": "Technology that replicates a specific person's voice from sample recordings. Can be done with as little as 3-15 seconds of reference audio using modern zero-shot approaches.",
    "domain": 1,
    "exam": false
  },
  {
    "term": "WebRTC",
    "full": "Web Real-Time Communication",
    "definition": "Open-source protocol for peer-to-peer audio, video, and data streaming in browsers. Provides low-latency (sub-100ms) transport with built-in NAT traversal, encryption, and adaptive bitrate.",
    "domain": 2,
    "exam": true
  },
  {
    "term": "TTFB",
    "full": "Time To First Byte",
    "definition": "Latency from when a request is sent to when the first byte of the response is received. In voice AI, measures how quickly the system starts responding after the user finishes speaking.",
    "domain": 2,
    "exam": true
  },
  {
    "term": "Cascaded Pipeline",
    "definition": "Traditional voice AI architecture where audio flows sequentially through ASR → LLM → TTS stages. Each stage adds latency. Total end-to-end latency is the sum of all stages (typically 400-1200ms).",
    "domain": 2,
    "exam": true
  },
  {
    "term": "Streaming ASR",
    "definition": "ASR that produces partial transcription results as audio arrives, rather than waiting for the complete utterance. Essential for real-time applications to reduce perceived latency.",
    "domain": 2,
    "exam": true
  },
  {
    "term": "Barge-in",
    "definition": "The ability for a user to interrupt the AI while it's speaking. Requires duplex audio, VAD on the user's stream, and the ability to immediately stop TTS playback and process the interruption.",
    "domain": 2,
    "exam": true
  },
  {
    "term": "Jitter Buffer",
    "definition": "A buffer that smooths out variations in network packet arrival times (jitter). Trades a small amount of added latency for consistent, gap-free audio playback. Critical for real-time voice quality.",
    "domain": 2,
    "exam": true
  },
  {
    "term": "Opus Codec",
    "definition": "A versatile, open-source audio codec designed for real-time communication. Supports bitrates from 6 to 510 kbps, handles speech and music, and is the default codec for WebRTC.",
    "domain": 2,
    "exam": true
  },
  {
    "term": "SIP",
    "full": "Session Initiation Protocol",
    "definition": "Signaling protocol for establishing, modifying, and terminating voice/video sessions in telephony. Used to connect voice AI systems to PSTN (phone) networks.",
    "domain": 2,
    "exam": true
  },
  {
    "term": "PSTN",
    "full": "Public Switched Telephone Network",
    "definition": "The traditional circuit-switched telephone network. Voice AI systems connect to PSTN via SIP trunking or telephony APIs (Twilio, Vonage) to handle phone calls.",
    "domain": 2,
    "exam": true
  },
  {
    "term": "Duplex Audio",
    "definition": "Simultaneous two-way audio communication where both parties can speak and listen at the same time. Required for natural conversational AI with barge-in support.",
    "domain": 2,
    "exam": true
  },
  {
    "term": "End-to-End Latency",
    "definition": "Total time from when a user finishes speaking to when they hear the AI's response begin. Includes ASR + LLM + TTS processing plus network transport. Under 500ms feels conversational.",
    "domain": 2,
    "exam": true
  },
  {
    "term": "NAT Traversal",
    "definition": "Techniques (STUN, TURN, ICE) that allow peer-to-peer connections through network address translators and firewalls. Built into WebRTC for reliable connectivity.",
    "domain": 2,
    "exam": false
  },
  {
    "term": "STUN",
    "full": "Session Traversal Utilities for NAT",
    "definition": "Protocol that helps clients discover their public IP address and port mapping. Used by WebRTC for NAT traversal when direct peer-to-peer connection is possible.",
    "domain": 2,
    "exam": false
  },
  {
    "term": "TURN",
    "full": "Traversal Using Relays around NAT",
    "definition": "Relay protocol used when direct peer-to-peer connection fails. Routes media through a server, adding latency but ensuring connectivity through restrictive firewalls.",
    "domain": 2,
    "exam": false
  },
  {
    "term": "ICE",
    "full": "Interactive Connectivity Establishment",
    "definition": "Framework that coordinates STUN and TURN to find the best connection path between peers. Tries direct connection first, falls back to relay if needed.",
    "domain": 2,
    "exam": false
  },
  {
    "term": "SFU",
    "full": "Selective Forwarding Unit",
    "definition": "A server that receives media streams and forwards them selectively to participants without mixing/transcoding. Used in platforms like LiveKit for scalable real-time audio/video.",
    "domain": 2,
    "exam": false
  },
  {
    "term": "PCM",
    "full": "Pulse-Code Modulation",
    "definition": "Uncompressed digital audio format. Voice AI pipelines often process raw PCM (16kHz, 16-bit mono) internally before encoding for transport.",
    "domain": 2,
    "exam": false
  },
  {
    "term": "Function Calling",
    "definition": "LLM capability to output structured JSON requesting specific function/API calls instead of plain text. Enables voice agents to book appointments, query databases, transfer calls, etc.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "RAG",
    "full": "Retrieval-Augmented Generation",
    "definition": "Pattern where relevant documents are retrieved from a knowledge base and injected into the LLM's context before generation. Reduces hallucination by grounding responses in real data.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "Hallucination",
    "definition": "When an LLM generates confident but factually incorrect information. Particularly dangerous in voice AI where users can't easily verify claims. Mitigated by RAG, grounding, and constrained generation.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "Context Window",
    "definition": "The maximum number of tokens an LLM can process in a single request (prompt + response). Conversation history, system prompts, and RAG content all compete for context window space.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "System Prompt",
    "definition": "Instructions provided to the LLM that define the voice agent's persona, rules, capabilities, and constraints. Critical for consistent behavior across conversations.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "Streaming LLM Response",
    "definition": "Generating LLM output token-by-token and sending partial results to TTS immediately, rather than waiting for the complete response. Reduces time-to-first-audio by 200-500ms.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "Turn-Taking",
    "definition": "The mechanism that manages when the AI should listen vs. speak in a conversation. Combines VAD, endpointing, silence thresholds, and sometimes LLM-based prediction.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "Conversation State",
    "definition": "The maintained context of an ongoing dialogue: user intent, extracted entities, task progress, and history. Must persist across turns and sometimes across sessions.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "Guardrails",
    "definition": "Constraints applied to LLM outputs to prevent harmful, off-topic, or policy-violating responses. Can be prompt-based, classifier-based, or use separate validation models.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "Intent Recognition",
    "definition": "Identifying what a user wants to accomplish from their utterance. Can be done by a dedicated NLU model or by the LLM itself via prompt engineering.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "Entity Extraction",
    "definition": "Identifying and extracting structured data (names, dates, amounts, locations) from user speech. Essential for form-filling voice flows like booking or customer service.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "Token",
    "definition": "The basic unit of text that LLMs process. Roughly ~4 characters or ~0.75 words in English. Token count affects latency, cost, and context window usage.",
    "domain": 3,
    "exam": false
  },
  {
    "term": "Embeddings",
    "definition": "Dense vector representations of text that capture semantic meaning. Used in RAG systems to find relevant documents by measuring cosine similarity between query and document embeddings.",
    "domain": 3,
    "exam": false
  },
  {
    "term": "Prompt Engineering",
    "definition": "The practice of crafting LLM instructions to elicit desired behavior. In voice AI, includes persona definition, response format constraints, and conversation flow rules.",
    "domain": 3,
    "exam": false
  },
  {
    "term": "Agent Loop",
    "definition": "The core cycle of a voice AI agent: listen → transcribe → reason → act/respond → speak → repeat. May include tool calls, state updates, and handoff decisions within each iteration.",
    "domain": 3,
    "exam": false
  },
  {
    "term": "Multimodal AI",
    "definition": "AI systems that process multiple input types (text, audio, images, video) natively. Emerging speech-to-speech models bypass the ASR→LLM→TTS pipeline entirely.",
    "domain": 3,
    "exam": false
  },
  {
    "term": "Speech-to-Speech Models",
    "definition": "Models that directly process audio input and produce audio output without intermediate text. Examples include GPT-4o audio mode and Moshi. Promise lower latency and better prosody preservation.",
    "domain": 3,
    "exam": false
  },
  {
    "term": "Persona",
    "definition": "The defined character, voice, and communication style of a voice agent. Includes name, personality traits, tone, vocabulary level, and domain expertise. Drives consistency across interactions.",
    "domain": 4,
    "exam": true
  },
  {
    "term": "Confirmation Strategy",
    "definition": "How the agent verifies critical information: explicit ('You said Dr. Smith, correct?'), implicit ('Booking with Dr. Smith for Tuesday...'), or none. Choice depends on error cost.",
    "domain": 4,
    "exam": true
  },
  {
    "term": "Error Recovery",
    "definition": "Strategies for handling misrecognition, user confusion, or system failures gracefully. Includes reprompting, offering alternatives, escalation to human, and progressive disclosure.",
    "domain": 4,
    "exam": true
  },
  {
    "term": "Wizard of Oz Testing",
    "definition": "Research method where a human secretly performs the AI's role while users believe they're interacting with a real system. Used to validate conversation flows before building the actual technology.",
    "domain": 4,
    "exam": true
  },
  {
    "term": "Progressive Disclosure",
    "definition": "Presenting information in layers rather than all at once. In voice, this means giving a brief answer first, then offering details if the user asks. Prevents overwhelming listeners.",
    "domain": 4,
    "exam": true
  },
  {
    "term": "Earcon",
    "definition": "A brief, distinctive sound used to convey information or status (e.g., a chime when the agent starts listening). The audio equivalent of an icon.",
    "domain": 4,
    "exam": true
  },
  {
    "term": "Latency Tolerance",
    "definition": "The maximum response delay users accept before perceiving the system as slow. For conversational voice: ~300ms feels instant, 500ms feels natural, >1s feels broken.",
    "domain": 4,
    "exam": true
  },
  {
    "term": "Conversational Repair",
    "definition": "Techniques for recovering from communication breakdowns: asking for repetition, offering choices, rephrasing questions, or acknowledging confusion before retrying.",
    "domain": 4,
    "exam": true
  },
  {
    "term": "Multimodal Feedback",
    "definition": "Combining voice with visual cues (text, indicators, animations) to improve understanding. Especially important in smart displays and mobile voice interfaces.",
    "domain": 4,
    "exam": false
  },
  {
    "term": "SSML",
    "full": "Speech Synthesis Markup Language",
    "definition": "XML-based markup for controlling TTS output: pauses, emphasis, pronunciation, speed, pitch, and volume. Supported by most TTS engines for fine-tuning speech delivery.",
    "domain": 4,
    "exam": false
  },
  {
    "term": "VUI",
    "full": "Voice User Interface",
    "definition": "Any interface where voice is the primary interaction modality. Includes smart speakers, IVR systems, in-car assistants, and voice-first mobile apps.",
    "domain": 4,
    "exam": false
  },
  {
    "term": "Discourse Marker",
    "definition": "Words or phrases that structure conversation ('So', 'Actually', 'By the way'). Adding discourse markers to TTS output makes AI speech sound more natural and conversational.",
    "domain": 4,
    "exam": false
  },
  {
    "term": "Filler Words",
    "definition": "Sounds like 'um', 'uh', 'hmm' that fill pauses in natural speech. Some voice AI systems intentionally add fillers to sound more human and buy processing time.",
    "domain": 4,
    "exam": false
  },
  {
    "term": "Affordance",
    "definition": "A cue that indicates what actions are possible. In voice, affordances are verbal: 'You can say yes, no, or tell me your account number' guides the user on valid responses.",
    "domain": 4,
    "exam": false
  },
  {
    "term": "HIPAA",
    "full": "Health Insurance Portability and Accountability Act",
    "definition": "US regulation governing protected health information (PHI). Voice AI in healthcare must encrypt audio, limit data retention, sign BAAs with vendors, and ensure PHI isn't used for training.",
    "domain": 5,
    "exam": true
  },
  {
    "term": "GDPR",
    "full": "General Data Protection Regulation",
    "definition": "EU regulation requiring explicit consent for data processing, right to erasure, data portability, and purpose limitation. Voice recordings are personal data under GDPR.",
    "domain": 5,
    "exam": true
  },
  {
    "term": "PII",
    "full": "Personally Identifiable Information",
    "definition": "Data that can identify an individual: name, SSN, address, voice biometric, etc. Voice AI must detect, mask, or redact PII in transcripts and recordings.",
    "domain": 5,
    "exam": true
  },
  {
    "term": "PCI DSS",
    "full": "Payment Card Industry Data Security Standard",
    "definition": "Security standard for handling credit card data. Voice AI processing payments must pause recording during card number capture and never store full card numbers.",
    "domain": 5,
    "exam": true
  },
  {
    "term": "Voice Biometrics",
    "definition": "Using unique vocal characteristics (pitch, cadence, formants) to verify a speaker's identity. Used for authentication in banking and enterprise. Raises consent and deepfake concerns.",
    "domain": 5,
    "exam": true
  },
  {
    "term": "MiFID II",
    "definition": "EU directive requiring financial firms to record and retain voice communications. Voice AI in finance must comply with recording, storage, and retrieval requirements.",
    "domain": 5,
    "exam": true
  },
  {
    "term": "Call Recording Consent",
    "definition": "Legal requirement to inform and/or obtain consent before recording calls. Laws vary by jurisdiction: one-party consent (US federal), two-party (California, EU), or all-party.",
    "domain": 5,
    "exam": true
  },
  {
    "term": "BAA",
    "full": "Business Associate Agreement",
    "definition": "HIPAA-required contract between a healthcare provider and any vendor handling PHI. Voice AI providers must sign BAAs before processing healthcare voice data.",
    "domain": 5,
    "exam": true
  },
  {
    "term": "IVR",
    "full": "Interactive Voice Response",
    "definition": "Automated phone system using menus and voice/DTMF input. Traditional IVR uses rigid decision trees; modern conversational IVR uses ASR + LLM for natural language navigation.",
    "domain": 5,
    "exam": true
  },
  {
    "term": "Agent Handoff",
    "definition": "Transferring a voice conversation from AI to a human agent, including full context (transcript, intent, customer info). Seamless handoff is critical for enterprise deployment.",
    "domain": 5,
    "exam": true
  },
  {
    "term": "CCaaS",
    "full": "Contact Center as a Service",
    "definition": "Cloud-based contact center platform (e.g., Genesys, Five9, NICE). Voice AI integrates with CCaaS for automated handling, agent assist, and post-call analytics.",
    "domain": 5,
    "exam": false
  },
  {
    "term": "AHT",
    "full": "Average Handle Time",
    "definition": "Mean duration of a customer interaction from start to resolution. Key contact center KPI. Voice AI aims to reduce AHT through automation and agent assist.",
    "domain": 5,
    "exam": false
  },
  {
    "term": "CSAT",
    "full": "Customer Satisfaction Score",
    "definition": "Post-interaction survey score measuring customer satisfaction. Voice AI deployments track CSAT to ensure automation doesn't degrade customer experience.",
    "domain": 5,
    "exam": false
  },
  {
    "term": "Sentiment Analysis",
    "definition": "Detecting emotional tone (positive, negative, neutral) from speech. Uses both text content and acoustic features (pitch, pace, volume). Used for real-time agent alerting and QA.",
    "domain": 5,
    "exam": false
  },
  {
    "term": "Data Residency",
    "definition": "Requirement that data be stored and processed within a specific geographic region. Voice data may need to stay within EU, US, or specific country boundaries per regulation.",
    "domain": 5,
    "exam": false
  },
  {
    "term": "SOC 2",
    "full": "System and Organization Controls 2",
    "definition": "Audit framework assessing cloud service security, availability, processing integrity, confidentiality, and privacy. Expected certification for enterprise voice AI vendors.",
    "domain": 5,
    "exam": false
  },
  {
    "term": "Deepfake Detection",
    "definition": "Technology to identify AI-generated or cloned voice audio. Increasingly important as voice cloning quality improves. Uses spectral analysis, artifact detection, and neural classifiers.",
    "domain": 5,
    "exam": false
  },
  {
    "term": "DTMF",
    "full": "Dual-Tone Multi-Frequency",
    "definition": "The tones generated by pressing phone keypad buttons. Used in IVR systems for menu navigation and as a fallback input method when ASR fails.",
    "domain": 5,
    "exam": false
  },
  {
    "term": "VoiceXML",
    "definition": "W3C standard markup language for creating voice dialogs. Historically used in IVR systems. Being superseded by LLM-based approaches but still present in legacy systems.",
    "exam": false
  },
  {
    "term": "Emotion AI",
    "definition": "Field of AI that detects, interprets, and simulates human emotions from voice, facial expressions, and text. Applications in customer service, healthcare, and education.",
    "exam": false
  },
  {
    "term": "Wake Word",
    "definition": "A specific phrase that activates a voice assistant (e.g., 'Hey Siri', 'Alexa'). Detected by a small, always-on neural network running locally on device.",
    "exam": false
  },
  {
    "term": "Noise Cancellation",
    "definition": "Signal processing that removes background noise from audio. Deep learning-based approaches (RNNoise, DTLN) now outperform traditional spectral subtraction methods.",
    "exam": false
  },
  {
    "term": "Echo Cancellation",
    "full": "AEC — Acoustic Echo Cancellation",
    "definition": "Removes the speaker's own audio from the microphone input to prevent feedback loops. Essential for speakerphone and smart speaker interactions.",
    "exam": false
  },
  {
    "term": "Beamforming",
    "definition": "Microphone array technique that focuses audio capture in a specific direction while suppressing sounds from other directions. Used in smart speakers and conference systems.",
    "exam": false
  },
  {
    "term": "Voice Agent",
    "definition": "An AI system that conducts spoken conversations autonomously. Combines ASR, LLM reasoning, TTS, and tool use to handle tasks like customer support, scheduling, and sales.",
    "exam": false
  },
  {
    "term": "Conversational AI",
    "definition": "Umbrella term for AI systems that engage in human-like dialogue. Includes chatbots (text), voice agents (audio), and multimodal assistants. Voice adds unique challenges around latency and turn-taking.",
    "exam": false
  },
  {
    "term": "Speaker Embedding",
    "definition": "A fixed-length vector that encodes a speaker's vocal identity (timbre, pitch range, resonance). Used in voice cloning and speaker verification to represent 'who' is speaking independently of 'what' they say.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "Vocoder",
    "definition": "The final stage in a TTS pipeline that converts a mel spectrogram into an audible waveform. Neural vocoders (HiFi-GAN, WaveGlow) produce high-quality audio; older vocoders (Griffin-Lim) sound metallic.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "Zero-shot Voice Cloning",
    "definition": "Replicating a speaker's voice from a few seconds of reference audio without fine-tuning. Extracts a speaker embedding on the fly. Trades some quality (prosody, nuance) for speed and convenience.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "NEER",
    "full": "Named Entity Error Rate",
    "definition": "Metric measuring ASR accuracy specifically on named entities (names, dates, amounts, locations). More relevant than WER for domain-specific applications like legal or medical transcription where getting entities right matters most.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "Code-switching",
    "definition": "Mixing two or more languages within a single conversation or sentence. Challenging for ASR because per-utterance language routing fails when the switch happens mid-sentence. Requires multilingual models trained on code-switched data.",
    "domain": 1,
    "exam": true
  },
  {
    "term": "Noise Augmentation",
    "definition": "Training technique that artificially adds background noise (babble, traffic, music) to clean audio data. Improves ASR robustness in noisy real-world environments by exposing the model to varied acoustic conditions during training.",
    "domain": 1,
    "exam": false
  },
  {
    "term": "Confidence Score",
    "definition": "A probability estimate from the ASR model indicating how certain it is about a transcript. Low confidence can trigger re-prompting, fallback to DTMF, or human escalation. Not always well-calibrated.",
    "domain": 1,
    "exam": false
  },
  {
    "term": "N-best List",
    "definition": "The top N most likely transcription hypotheses from an ASR decoder, ranked by score. Used for re-ranking with external models, disambiguation, or presenting alternatives when the top result is uncertain.",
    "domain": 1,
    "exam": false
  },
  {
    "term": "MFCC",
    "full": "Mel-Frequency Cepstral Coefficients",
    "definition": "A compact representation of the short-term power spectrum of audio, mapped to the mel scale. Historically the standard ASR input feature. Largely replaced by mel spectrograms in modern deep learning systems.",
    "domain": 1,
    "exam": false
  },
  {
    "term": "Sample Rate",
    "definition": "The number of audio samples captured per second, measured in Hz. Telephony uses 8kHz (narrowband); wideband voice uses 16kHz; high-fidelity audio uses 44.1-48kHz. Higher rates capture more frequency information.",
    "domain": 1,
    "exam": false
  },
  {
    "term": "Beam Search",
    "definition": "A decoding strategy that explores multiple hypotheses simultaneously, keeping the top-k most promising candidates at each step. Balances accuracy (wider beam) against speed (narrower beam). Standard in ASR and TTS.",
    "domain": 1,
    "exam": false
  },
  {
    "term": "Attention Mechanism",
    "definition": "A neural network component that learns which parts of the input to focus on when producing each output element. Fundamental to transformer-based ASR and TTS. Enables capturing long-range dependencies in audio sequences.",
    "domain": 1,
    "exam": false
  },
  {
    "term": "FEC",
    "full": "Forward Error Correction",
    "definition": "Adding redundant data to audio packets so lost packets can be reconstructed without retransmission. Critical for real-time voice over unreliable networks (cellular, congested Wi-Fi) where retransmission adds unacceptable latency.",
    "domain": 2,
    "exam": true
  },
  {
    "term": "G.711",
    "definition": "The standard audio codec for PSTN telephony. Uses 64 kbps PCM encoding (a-law or mu-law). Universal compatibility but no compression. Voice AI systems connecting to phone networks often use G.711, with Opus for WebRTC.",
    "domain": 2,
    "exam": true
  },
  {
    "term": "Media Gateway",
    "definition": "A server that bridges different audio transport protocols — typically converting between SIP/RTP (telephony) and WebRTC. Handles codec transcoding, echo cancellation, and protocol translation. Adds latency to the pipeline.",
    "domain": 2,
    "exam": true
  },
  {
    "term": "Speculative Execution",
    "definition": "Starting LLM inference on partial ASR transcripts before the user finishes speaking, betting that the transcript won't change. Reduces latency when the bet is correct but wastes compute when the ASR revises its hypothesis.",
    "domain": 2,
    "exam": true
  },
  {
    "term": "Latency Budget",
    "definition": "The total allowable end-to-end latency divided across pipeline stages. For a 500ms target: ASR ~100ms, LLM ~250ms, TTS ~100ms, network ~50ms. Helps identify which stage to optimize when the budget is exceeded.",
    "domain": 2,
    "exam": false
  },
  {
    "term": "AGC",
    "full": "Automatic Gain Control",
    "definition": "Signal processing that normalizes audio volume in real time — boosting quiet speech and attenuating loud speech. Ensures consistent input levels to the ASR regardless of microphone distance or speaker volume.",
    "domain": 2,
    "exam": false
  },
  {
    "term": "RTP",
    "full": "Real-time Transport Protocol",
    "definition": "Protocol for delivering audio and video over IP networks. Carries the actual media data in WebRTC and SIP calls. Works alongside RTCP (control protocol) for quality monitoring and synchronization.",
    "domain": 2,
    "exam": false
  },
  {
    "term": "Adaptive Bitrate",
    "definition": "Dynamically adjusting audio codec bitrate based on network conditions. When bandwidth drops, lower the bitrate to maintain continuity at the cost of quality. Opus supports this natively, ranging from 6 to 510 kbps.",
    "domain": 2,
    "exam": false
  },
  {
    "term": "Slot-filling",
    "definition": "A dialogue pattern where the agent collects required data fields (slots) from the user — like name, date, and location for a booking. Tracks which slots are filled vs. missing and prompts only for gaps. Supports out-of-order input.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "Disfluency Filtering",
    "definition": "Preprocessing that strips filler words ('um', 'uh', 'like'), false starts, and repetitions from ASR output before passing to the LLM. Produces cleaner input without requiring users to speak unnaturally.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "Circuit Breaker Pattern",
    "definition": "A server-side safety mechanism that halts repeated tool calls or API requests after a configurable limit. Prevents infinite loops in LLM function-calling by forcing the model to generate a user-facing response from available data.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "Rolling Summary",
    "definition": "A context management strategy that compresses older conversation turns into a concise summary while keeping recent turns verbatim. Prevents context window overflow in long calls while preserving critical early information.",
    "domain": 3,
    "exam": true
  },
  {
    "term": "Fan-out Pattern",
    "definition": "An orchestration approach where multiple independent operations (RAG retrieval, API calls, database queries) execute in parallel, and results are assembled before a single LLM generation call. Minimizes total latency.",
    "domain": 3,
    "exam": false
  },
  {
    "term": "Structured Output",
    "definition": "Constraining LLM generation to produce valid JSON or other structured formats. Essential for function calling, entity extraction, and any pipeline step that needs machine-readable LLM output rather than free text.",
    "domain": 3,
    "exam": false
  },
  {
    "term": "TTFT",
    "full": "Time to First Token",
    "definition": "The latency from sending a prompt to the LLM until the first output token is generated. Dominated by prompt processing time. Grows with conversation history length and system prompt size.",
    "domain": 3,
    "exam": false
  },
  {
    "term": "Compound Question",
    "definition": "A user utterance containing multiple questions or requests ('What's the price, do you deliver, and is it in stock?'). Requires decomposition into individual queries with structured, verbally-marked responses.",
    "domain": 4,
    "exam": true
  },
  {
    "term": "Context-sensitive Persona",
    "definition": "Dynamically adjusting the agent's tone and communication style based on the nature of the interaction — warm and empathetic for complaints, professional and efficient for technical support.",
    "domain": 4,
    "exam": true
  },
  {
    "term": "Urgency Detection",
    "definition": "Identifying signals in user speech that indicate time-critical situations (medical emergencies, safety threats). Should trigger escalation protocols that override normal conversation flow.",
    "domain": 4,
    "exam": true
  },
  {
    "term": "Verbal Marker",
    "definition": "Phrases like 'Regarding your first question...', 'On pricing...', 'And about delivery...' that structure spoken responses. Help listeners track which part of a multi-part answer is being addressed.",
    "domain": 4,
    "exam": false
  },
  {
    "term": "Silence Threshold",
    "definition": "The duration of silence the system waits before concluding the user has finished speaking (end-of-utterance detection). Too short clips users mid-thought; too long creates awkward pauses.",
    "domain": 4,
    "exam": false
  },
  {
    "term": "BIPA",
    "full": "Illinois Biometric Information Privacy Act",
    "definition": "One of the strictest US biometric privacy laws. Covers voiceprints as biometric identifiers. Requires written consent before collection, a public retention/destruction policy, and provides a private right of action ($1,000-$5,000 per violation).",
    "domain": 5,
    "exam": true
  },
  {
    "term": "CCPA",
    "full": "California Consumer Privacy Act",
    "definition": "California state privacy law giving residents rights over their personal data: right to know, delete, opt out of sale, and non-discrimination. Applies to voice recordings and transcripts containing personal information.",
    "domain": 5,
    "exam": true
  },
  {
    "term": "DPA",
    "full": "Data Processing Agreement",
    "definition": "A legally binding contract between a data controller and a data processor (or sub-processor) that specifies how personal data is handled. Required under GDPR when using third-party services like cloud ASR providers.",
    "domain": 5,
    "exam": true
  },
  {
    "term": "Sub-processor",
    "definition": "A third party that processes personal data on behalf of a data processor. In voice AI, cloud ASR/TTS providers are sub-processors. Their data handling practices must be disclosed and governed by a DPA.",
    "domain": 5,
    "exam": true
  },
  {
    "term": "Purpose Limitation",
    "definition": "GDPR principle (Article 5(1)(b)) requiring that data collected for one purpose cannot be used for another without separate consent. Voice recordings collected for service delivery cannot be repurposed for model training without explicit, specific consent.",
    "domain": 5,
    "exam": true
  },
  {
    "term": "Right of Publicity",
    "definition": "Legal right to control commercial use of one's identity — including voice. Violated by unconsented voice cloning. Several US states have specific legislation (Tennessee ELVIS Act, California, Illinois BIPA).",
    "domain": 5,
    "exam": true
  },
  {
    "term": "GDPR Article 22",
    "definition": "Grants individuals the right not to be subject to decisions based solely on automated processing that produce legal or similarly significant effects. Relevant when voice AI makes consequential decisions (claim denials, credit decisions).",
    "domain": 5,
    "exam": true
  },
  {
    "term": "Algorithmic Bias",
    "definition": "Systematic discrimination in automated decision-making caused by biased training data or model design. In voice AI, can manifest as ASR accuracy disparities across accents or unfair automated decisions correlated with speaking patterns.",
    "domain": 5,
    "exam": false
  },
  {
    "term": "Audio Watermarking",
    "definition": "Embedding imperceptible signals into synthesized audio to identify it as AI-generated. Emerging requirement for synthetic media transparency. Helps detect deepfakes and comply with AI disclosure regulations.",
    "exam": false
  },
  {
    "term": "On-device ASR",
    "definition": "Running speech recognition locally on the user's device rather than in the cloud. Eliminates network latency and keeps audio data private. Constrained by device compute (smaller models, lower accuracy).",
    "exam": false
  },
  {
    "term": "Synthetic Media",
    "definition": "Any media (audio, video, images) generated or manipulated by AI. Voice cloning output is synthetic media. Subject to emerging regulations requiring disclosure and consent.",
    "exam": false
  }
];
