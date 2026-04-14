import { useState, useMemo } from "react";
import { ChevronRight, ChevronDown, Mic, Radio, Brain, Headphones, Shield, RotateCcw, CheckCircle, XCircle, AlertCircle, Award, Search, BookOpen, Share2, Linkedin, Twitter, Copy } from "lucide-react";

const DOMAINS = [
  { id: 1, name: "Voice AI Fundamentals", short: "Fundamentals", weight: "20%", icon: Mic, color: "#000" },
  { id: 2, name: "Real-Time Architecture & Pipelines", short: "Architecture", weight: "22%", icon: Radio, color: "#000" },
  { id: 3, name: "LLM + Voice Orchestration", short: "Orchestration", weight: "22%", icon: Brain, color: "#000" },
  { id: 4, name: "Voice UX & Conversation Design", short: "UX & Design", weight: "18%", icon: Headphones, color: "#000" },
  { id: 5, name: "Enterprise, Compliance & Verticals", short: "Compliance", weight: "18%", icon: Shield, color: "#000" },
];

const GLOSSARY = [
  // ─── DOMAIN 1: Voice AI Fundamentals ───
  { term: "ASR", full: "Automatic Speech Recognition", definition: "Technology that converts spoken language into text. Modern ASR systems use deep learning models (transformers, CTC, RNN-T) to transcribe audio in real time or from recordings.", domain: 1, exam: true },
  { term: "TTS", full: "Text-to-Speech", definition: "Converts written text into synthesized spoken audio. Neural TTS (transformer/diffusion-based) produces near-human naturalness, replacing older concatenative and formant methods.", domain: 1, exam: true },
  { term: "STT", full: "Speech-to-Text", definition: "Synonym for ASR. Converts audio input into written text output.", domain: 1, exam: true },
  { term: "WER", full: "Word Error Rate", definition: "Primary metric for ASR accuracy. Calculated as (Substitutions + Insertions + Deletions) / Total Reference Words. Lower is better. Domain-specific test sets (medical, legal) give more meaningful WER than generic benchmarks.", domain: 1, exam: true },
  { term: "MOS", full: "Mean Opinion Score", definition: "Subjective speech quality metric rated on a 1–5 scale by human listeners. Used to evaluate TTS naturalness, codec quality, and voice cloning fidelity. 4.0+ is considered high quality.", domain: 1, exam: true },
  { term: "RTF", full: "Real-Time Factor", definition: "Ratio of processing time to audio duration. An RTF of 0.5 means 1 second of audio is processed in 0.5 seconds. Must be < 1.0 for real-time applications.", domain: 1, exam: true },
  { term: "Speaker Diarization", definition: "The process of identifying 'who spoke when' in a multi-speaker audio recording. Segments audio by speaker identity without necessarily identifying who the speakers are.", domain: 1, exam: true },
  { term: "Neural TTS", definition: "Text-to-speech systems using deep neural networks (transformers, diffusion models, or autoregressive models) to generate highly natural-sounding speech. Examples include VALL-E, Tortoise TTS, and ElevenLabs.", domain: 1, exam: true },
  { term: "Concatenative Synthesis", definition: "Older TTS approach that stitches together pre-recorded audio segments. Produces robotic-sounding speech at segment boundaries. Largely replaced by neural methods.", domain: 1, exam: true },
  { term: "Formant Synthesis", definition: "Rule-based TTS that generates speech by modeling acoustic resonances (formants) of the vocal tract. Very fast and lightweight but sounds artificial.", domain: 1, exam: true },
  { term: "Voice Activity Detection", full: "VAD", definition: "Algorithm that detects whether a segment of audio contains human speech or silence/noise. Critical for turn-taking, endpointing, and reducing unnecessary ASR processing.", domain: 1, exam: true },
  { term: "Endpointing", definition: "Detecting when a speaker has finished their utterance. Accurate endpointing prevents cutting off users mid-sentence and reduces awkward pauses in conversational AI.", domain: 1, exam: true },
  { term: "Phoneme", definition: "The smallest unit of sound that distinguishes meaning in a language. ASR and TTS systems often use phoneme representations as intermediate features. English has roughly 44 phonemes.", domain: 1, exam: false },
  { term: "Prosody", definition: "The rhythm, stress, and intonation patterns of speech. Prosody carries emotional and contextual meaning beyond the words themselves. Advanced TTS systems model prosody explicitly.", domain: 1, exam: false },
  { term: "Mel Spectrogram", definition: "A visual representation of audio frequencies mapped to the mel scale (which approximates human hearing). Used as input features for most modern ASR and TTS models.", domain: 1, exam: false },
  { term: "CTC", full: "Connectionist Temporal Classification", definition: "A loss function and decoding strategy used in ASR that allows models to output sequences without requiring precise alignment between audio frames and text labels.", domain: 1, exam: false },
  { term: "RNN-T", full: "Recurrent Neural Network Transducer", definition: "An end-to-end ASR architecture that combines an encoder, prediction network, and joint network. Used in streaming ASR systems like those from Google.", domain: 1, exam: false },
  { term: "Voice Cloning", definition: "Technology that replicates a specific person's voice from sample recordings. Can be done with as little as 3-15 seconds of reference audio using modern zero-shot approaches.", domain: 1, exam: false },

  // ─── DOMAIN 2: Real-Time Architecture & Pipelines ───
  { term: "WebRTC", full: "Web Real-Time Communication", definition: "Open-source protocol for peer-to-peer audio, video, and data streaming in browsers. Provides low-latency (sub-100ms) transport with built-in NAT traversal, encryption, and adaptive bitrate.", domain: 2, exam: true },
  { term: "TTFB", full: "Time To First Byte", definition: "Latency from when a request is sent to when the first byte of the response is received. In voice AI, measures how quickly the system starts responding after the user finishes speaking.", domain: 2, exam: true },
  { term: "Cascaded Pipeline", definition: "Traditional voice AI architecture where audio flows sequentially through ASR → LLM → TTS stages. Each stage adds latency. Total end-to-end latency is the sum of all stages (typically 400-1200ms).", domain: 2, exam: true },
  { term: "Streaming ASR", definition: "ASR that produces partial transcription results as audio arrives, rather than waiting for the complete utterance. Essential for real-time applications to reduce perceived latency.", domain: 2, exam: true },
  { term: "Barge-in", definition: "The ability for a user to interrupt the AI while it's speaking. Requires duplex audio, VAD on the user's stream, and the ability to immediately stop TTS playback and process the interruption.", domain: 2, exam: true },
  { term: "Jitter Buffer", definition: "A buffer that smooths out variations in network packet arrival times (jitter). Trades a small amount of added latency for consistent, gap-free audio playback. Critical for real-time voice quality.", domain: 2, exam: true },
  { term: "Opus Codec", definition: "A versatile, open-source audio codec designed for real-time communication. Supports bitrates from 6 to 510 kbps, handles speech and music, and is the default codec for WebRTC.", domain: 2, exam: true },
  { term: "SIP", full: "Session Initiation Protocol", definition: "Signaling protocol for establishing, modifying, and terminating voice/video sessions in telephony. Used to connect voice AI systems to PSTN (phone) networks.", domain: 2, exam: true },
  { term: "PSTN", full: "Public Switched Telephone Network", definition: "The traditional circuit-switched telephone network. Voice AI systems connect to PSTN via SIP trunking or telephony APIs (Twilio, Vonage) to handle phone calls.", domain: 2, exam: true },
  { term: "Duplex Audio", definition: "Simultaneous two-way audio communication where both parties can speak and listen at the same time. Required for natural conversational AI with barge-in support.", domain: 2, exam: true },
  { term: "End-to-End Latency", definition: "Total time from when a user finishes speaking to when they hear the AI's response begin. Includes ASR + LLM + TTS processing plus network transport. Under 500ms feels conversational.", domain: 2, exam: true },
  { term: "NAT Traversal", definition: "Techniques (STUN, TURN, ICE) that allow peer-to-peer connections through network address translators and firewalls. Built into WebRTC for reliable connectivity.", domain: 2, exam: false },
  { term: "STUN", full: "Session Traversal Utilities for NAT", definition: "Protocol that helps clients discover their public IP address and port mapping. Used by WebRTC for NAT traversal when direct peer-to-peer connection is possible.", domain: 2, exam: false },
  { term: "TURN", full: "Traversal Using Relays around NAT", definition: "Relay protocol used when direct peer-to-peer connection fails. Routes media through a server, adding latency but ensuring connectivity through restrictive firewalls.", domain: 2, exam: false },
  { term: "ICE", full: "Interactive Connectivity Establishment", definition: "Framework that coordinates STUN and TURN to find the best connection path between peers. Tries direct connection first, falls back to relay if needed.", domain: 2, exam: false },
  { term: "SFU", full: "Selective Forwarding Unit", definition: "A server that receives media streams and forwards them selectively to participants without mixing/transcoding. Used in platforms like LiveKit for scalable real-time audio/video.", domain: 2, exam: false },
  { term: "PCM", full: "Pulse-Code Modulation", definition: "Uncompressed digital audio format. Voice AI pipelines often process raw PCM (16kHz, 16-bit mono) internally before encoding for transport.", domain: 2, exam: false },

  // ─── DOMAIN 3: LLM + Voice Orchestration ───
  { term: "Function Calling", definition: "LLM capability to output structured JSON requesting specific function/API calls instead of plain text. Enables voice agents to book appointments, query databases, transfer calls, etc.", domain: 3, exam: true },
  { term: "RAG", full: "Retrieval-Augmented Generation", definition: "Pattern where relevant documents are retrieved from a knowledge base and injected into the LLM's context before generation. Reduces hallucination by grounding responses in real data.", domain: 3, exam: true },
  { term: "Hallucination", definition: "When an LLM generates confident but factually incorrect information. Particularly dangerous in voice AI where users can't easily verify claims. Mitigated by RAG, grounding, and constrained generation.", domain: 3, exam: true },
  { term: "Context Window", definition: "The maximum number of tokens an LLM can process in a single request (prompt + response). Conversation history, system prompts, and RAG content all compete for context window space.", domain: 3, exam: true },
  { term: "System Prompt", definition: "Instructions provided to the LLM that define the voice agent's persona, rules, capabilities, and constraints. Critical for consistent behavior across conversations.", domain: 3, exam: true },
  { term: "Streaming LLM Response", definition: "Generating LLM output token-by-token and sending partial results to TTS immediately, rather than waiting for the complete response. Reduces time-to-first-audio by 200-500ms.", domain: 3, exam: true },
  { term: "Turn-Taking", definition: "The mechanism that manages when the AI should listen vs. speak in a conversation. Combines VAD, endpointing, silence thresholds, and sometimes LLM-based prediction.", domain: 3, exam: true },
  { term: "Conversation State", definition: "The maintained context of an ongoing dialogue: user intent, extracted entities, task progress, and history. Must persist across turns and sometimes across sessions.", domain: 3, exam: true },
  { term: "Guardrails", definition: "Constraints applied to LLM outputs to prevent harmful, off-topic, or policy-violating responses. Can be prompt-based, classifier-based, or use separate validation models.", domain: 3, exam: true },
  { term: "Intent Recognition", definition: "Identifying what a user wants to accomplish from their utterance. Can be done by a dedicated NLU model or by the LLM itself via prompt engineering.", domain: 3, exam: true },
  { term: "Entity Extraction", definition: "Identifying and extracting structured data (names, dates, amounts, locations) from user speech. Essential for form-filling voice flows like booking or customer service.", domain: 3, exam: true },
  { term: "Token", definition: "The basic unit of text that LLMs process. Roughly ~4 characters or ~0.75 words in English. Token count affects latency, cost, and context window usage.", domain: 3, exam: false },
  { term: "Embeddings", definition: "Dense vector representations of text that capture semantic meaning. Used in RAG systems to find relevant documents by measuring cosine similarity between query and document embeddings.", domain: 3, exam: false },
  { term: "Prompt Engineering", definition: "The practice of crafting LLM instructions to elicit desired behavior. In voice AI, includes persona definition, response format constraints, and conversation flow rules.", domain: 3, exam: false },
  { term: "Agent Loop", definition: "The core cycle of a voice AI agent: listen → transcribe → reason → act/respond → speak → repeat. May include tool calls, state updates, and handoff decisions within each iteration.", domain: 3, exam: false },
  { term: "Multimodal AI", definition: "AI systems that process multiple input types (text, audio, images, video) natively. Emerging speech-to-speech models bypass the ASR→LLM→TTS pipeline entirely.", domain: 3, exam: false },
  { term: "Speech-to-Speech Models", definition: "Models that directly process audio input and produce audio output without intermediate text. Examples include GPT-4o audio mode and Moshi. Promise lower latency and better prosody preservation.", domain: 3, exam: false },

  // ─── DOMAIN 4: Voice UX & Conversation Design ───
  { term: "Persona", definition: "The defined character, voice, and communication style of a voice agent. Includes name, personality traits, tone, vocabulary level, and domain expertise. Drives consistency across interactions.", domain: 4, exam: true },
  { term: "Confirmation Strategy", definition: "How the agent verifies critical information: explicit ('You said Dr. Smith, correct?'), implicit ('Booking with Dr. Smith for Tuesday...'), or none. Choice depends on error cost.", domain: 4, exam: true },
  { term: "Error Recovery", definition: "Strategies for handling misrecognition, user confusion, or system failures gracefully. Includes reprompting, offering alternatives, escalation to human, and progressive disclosure.", domain: 4, exam: true },
  { term: "Wizard of Oz Testing", definition: "Research method where a human secretly performs the AI's role while users believe they're interacting with a real system. Used to validate conversation flows before building the actual technology.", domain: 4, exam: true },
  { term: "Progressive Disclosure", definition: "Presenting information in layers rather than all at once. In voice, this means giving a brief answer first, then offering details if the user asks. Prevents overwhelming listeners.", domain: 4, exam: true },
  { term: "Earcon", definition: "A brief, distinctive sound used to convey information or status (e.g., a chime when the agent starts listening). The audio equivalent of an icon.", domain: 4, exam: true },
  { term: "Latency Tolerance", definition: "The maximum response delay users accept before perceiving the system as slow. For conversational voice: ~300ms feels instant, 500ms feels natural, >1s feels broken.", domain: 4, exam: true },
  { term: "Conversational Repair", definition: "Techniques for recovering from communication breakdowns: asking for repetition, offering choices, rephrasing questions, or acknowledging confusion before retrying.", domain: 4, exam: true },
  { term: "Multimodal Feedback", definition: "Combining voice with visual cues (text, indicators, animations) to improve understanding. Especially important in smart displays and mobile voice interfaces.", domain: 4, exam: false },
  { term: "SSML", full: "Speech Synthesis Markup Language", definition: "XML-based markup for controlling TTS output: pauses, emphasis, pronunciation, speed, pitch, and volume. Supported by most TTS engines for fine-tuning speech delivery.", domain: 4, exam: false },
  { term: "VUI", full: "Voice User Interface", definition: "Any interface where voice is the primary interaction modality. Includes smart speakers, IVR systems, in-car assistants, and voice-first mobile apps.", domain: 4, exam: false },
  { term: "Discourse Marker", definition: "Words or phrases that structure conversation ('So', 'Actually', 'By the way'). Adding discourse markers to TTS output makes AI speech sound more natural and conversational.", domain: 4, exam: false },
  { term: "Filler Words", definition: "Sounds like 'um', 'uh', 'hmm' that fill pauses in natural speech. Some voice AI systems intentionally add fillers to sound more human and buy processing time.", domain: 4, exam: false },
  { term: "Affordance", definition: "A cue that indicates what actions are possible. In voice, affordances are verbal: 'You can say yes, no, or tell me your account number' guides the user on valid responses.", domain: 4, exam: false },

  // ─── DOMAIN 5: Enterprise, Compliance & Verticals ───
  { term: "HIPAA", full: "Health Insurance Portability and Accountability Act", definition: "US regulation governing protected health information (PHI). Voice AI in healthcare must encrypt audio, limit data retention, sign BAAs with vendors, and ensure PHI isn't used for training.", domain: 5, exam: true },
  { term: "GDPR", full: "General Data Protection Regulation", definition: "EU regulation requiring explicit consent for data processing, right to erasure, data portability, and purpose limitation. Voice recordings are personal data under GDPR.", domain: 5, exam: true },
  { term: "PII", full: "Personally Identifiable Information", definition: "Data that can identify an individual: name, SSN, address, voice biometric, etc. Voice AI must detect, mask, or redact PII in transcripts and recordings.", domain: 5, exam: true },
  { term: "PCI DSS", full: "Payment Card Industry Data Security Standard", definition: "Security standard for handling credit card data. Voice AI processing payments must pause recording during card number capture and never store full card numbers.", domain: 5, exam: true },
  { term: "Voice Biometrics", definition: "Using unique vocal characteristics (pitch, cadence, formants) to verify a speaker's identity. Used for authentication in banking and enterprise. Raises consent and deepfake concerns.", domain: 5, exam: true },
  { term: "MiFID II", definition: "EU directive requiring financial firms to record and retain voice communications. Voice AI in finance must comply with recording, storage, and retrieval requirements.", domain: 5, exam: true },
  { term: "Call Recording Consent", definition: "Legal requirement to inform and/or obtain consent before recording calls. Laws vary by jurisdiction: one-party consent (US federal), two-party (California, EU), or all-party.", domain: 5, exam: true },
  { term: "BAA", full: "Business Associate Agreement", definition: "HIPAA-required contract between a healthcare provider and any vendor handling PHI. Voice AI providers must sign BAAs before processing healthcare voice data.", domain: 5, exam: true },
  { term: "IVR", full: "Interactive Voice Response", definition: "Automated phone system using menus and voice/DTMF input. Traditional IVR uses rigid decision trees; modern conversational IVR uses ASR + LLM for natural language navigation.", domain: 5, exam: true },
  { term: "Agent Handoff", definition: "Transferring a voice conversation from AI to a human agent, including full context (transcript, intent, customer info). Seamless handoff is critical for enterprise deployment.", domain: 5, exam: true },
  { term: "CCaaS", full: "Contact Center as a Service", definition: "Cloud-based contact center platform (e.g., Genesys, Five9, NICE). Voice AI integrates with CCaaS for automated handling, agent assist, and post-call analytics.", domain: 5, exam: false },
  { term: "AHT", full: "Average Handle Time", definition: "Mean duration of a customer interaction from start to resolution. Key contact center KPI. Voice AI aims to reduce AHT through automation and agent assist.", domain: 5, exam: false },
  { term: "CSAT", full: "Customer Satisfaction Score", definition: "Post-interaction survey score measuring customer satisfaction. Voice AI deployments track CSAT to ensure automation doesn't degrade customer experience.", domain: 5, exam: false },
  { term: "Sentiment Analysis", definition: "Detecting emotional tone (positive, negative, neutral) from speech. Uses both text content and acoustic features (pitch, pace, volume). Used for real-time agent alerting and QA.", domain: 5, exam: false },
  { term: "Data Residency", definition: "Requirement that data be stored and processed within a specific geographic region. Voice data may need to stay within EU, US, or specific country boundaries per regulation.", domain: 5, exam: false },
  { term: "SOC 2", full: "System and Organization Controls 2", definition: "Audit framework assessing cloud service security, availability, processing integrity, confidentiality, and privacy. Expected certification for enterprise voice AI vendors.", domain: 5, exam: false },
  { term: "Deepfake Detection", definition: "Technology to identify AI-generated or cloned voice audio. Increasingly important as voice cloning quality improves. Uses spectral analysis, artifact detection, and neural classifiers.", domain: 5, exam: false },
  { term: "DTMF", full: "Dual-Tone Multi-Frequency", definition: "The tones generated by pressing phone keypad buttons. Used in IVR systems for menu navigation and as a fallback input method when ASR fails.", domain: 5, exam: false },

  // ─── BROADER ECOSYSTEM (no domain) ───
  { term: "VoiceXML", definition: "W3C standard markup language for creating voice dialogs. Historically used in IVR systems. Being superseded by LLM-based approaches but still present in legacy systems.", exam: false },
  { term: "Emotion AI", definition: "Field of AI that detects, interprets, and simulates human emotions from voice, facial expressions, and text. Applications in customer service, healthcare, and education.", exam: false },
  { term: "Wake Word", definition: "A specific phrase that activates a voice assistant (e.g., 'Hey Siri', 'Alexa'). Detected by a small, always-on neural network running locally on device.", exam: false },
  { term: "Noise Cancellation", definition: "Signal processing that removes background noise from audio. Deep learning-based approaches (RNNoise, DTLN) now outperform traditional spectral subtraction methods.", exam: false },
  { term: "Echo Cancellation", full: "AEC — Acoustic Echo Cancellation", definition: "Removes the speaker's own audio from the microphone input to prevent feedback loops. Essential for speakerphone and smart speaker interactions.", exam: false },
  { term: "Beamforming", definition: "Microphone array technique that focuses audio capture in a specific direction while suppressing sounds from other directions. Used in smart speakers and conference systems.", exam: false },
  { term: "Voice Agent", definition: "An AI system that conducts spoken conversations autonomously. Combines ASR, LLM reasoning, TTS, and tool use to handle tasks like customer support, scheduling, and sales.", exam: false },
  { term: "Conversational AI", definition: "Umbrella term for AI systems that engage in human-like dialogue. Includes chatbots (text), voice agents (audio), and multimodal assistants. Voice adds unique challenges around latency and turn-taking.", exam: false },

  // ─── ADDITIONAL TERMS (from intermediate/expert questions + core concepts) ───

  // Domain 1 additions
  { term: "Speaker Embedding", definition: "A fixed-length vector that encodes a speaker's vocal identity (timbre, pitch range, resonance). Used in voice cloning and speaker verification to represent 'who' is speaking independently of 'what' they say.", domain: 1, exam: true },
  { term: "Vocoder", definition: "The final stage in a TTS pipeline that converts a mel spectrogram into an audible waveform. Neural vocoders (HiFi-GAN, WaveGlow) produce high-quality audio; older vocoders (Griffin-Lim) sound metallic.", domain: 1, exam: true },
  { term: "Zero-shot Voice Cloning", definition: "Replicating a speaker's voice from a few seconds of reference audio without fine-tuning. Extracts a speaker embedding on the fly. Trades some quality (prosody, nuance) for speed and convenience.", domain: 1, exam: true },
  { term: "NEER", full: "Named Entity Error Rate", definition: "Metric measuring ASR accuracy specifically on named entities (names, dates, amounts, locations). More relevant than WER for domain-specific applications like legal or medical transcription where getting entities right matters most.", domain: 1, exam: true },
  { term: "Code-switching", definition: "Mixing two or more languages within a single conversation or sentence. Challenging for ASR because per-utterance language routing fails when the switch happens mid-sentence. Requires multilingual models trained on code-switched data.", domain: 1, exam: true },
  { term: "Noise Augmentation", definition: "Training technique that artificially adds background noise (babble, traffic, music) to clean audio data. Improves ASR robustness in noisy real-world environments by exposing the model to varied acoustic conditions during training.", domain: 1, exam: false },
  { term: "Confidence Score", definition: "A probability estimate from the ASR model indicating how certain it is about a transcript. Low confidence can trigger re-prompting, fallback to DTMF, or human escalation. Not always well-calibrated.", domain: 1, exam: false },
  { term: "N-best List", definition: "The top N most likely transcription hypotheses from an ASR decoder, ranked by score. Used for re-ranking with external models, disambiguation, or presenting alternatives when the top result is uncertain.", domain: 1, exam: false },
  { term: "MFCC", full: "Mel-Frequency Cepstral Coefficients", definition: "A compact representation of the short-term power spectrum of audio, mapped to the mel scale. Historically the standard ASR input feature. Largely replaced by mel spectrograms in modern deep learning systems.", domain: 1, exam: false },
  { term: "Sample Rate", definition: "The number of audio samples captured per second, measured in Hz. Telephony uses 8kHz (narrowband); wideband voice uses 16kHz; high-fidelity audio uses 44.1-48kHz. Higher rates capture more frequency information.", domain: 1, exam: false },
  { term: "Beam Search", definition: "A decoding strategy that explores multiple hypotheses simultaneously, keeping the top-k most promising candidates at each step. Balances accuracy (wider beam) against speed (narrower beam). Standard in ASR and TTS.", domain: 1, exam: false },
  { term: "Attention Mechanism", definition: "A neural network component that learns which parts of the input to focus on when producing each output element. Fundamental to transformer-based ASR and TTS. Enables capturing long-range dependencies in audio sequences.", domain: 1, exam: false },

  // Domain 2 additions
  { term: "FEC", full: "Forward Error Correction", definition: "Adding redundant data to audio packets so lost packets can be reconstructed without retransmission. Critical for real-time voice over unreliable networks (cellular, congested Wi-Fi) where retransmission adds unacceptable latency.", domain: 2, exam: true },
  { term: "G.711", definition: "The standard audio codec for PSTN telephony. Uses 64 kbps PCM encoding (a-law or mu-law). Universal compatibility but no compression. Voice AI systems connecting to phone networks often use G.711, with Opus for WebRTC.", domain: 2, exam: true },
  { term: "Media Gateway", definition: "A server that bridges different audio transport protocols — typically converting between SIP/RTP (telephony) and WebRTC. Handles codec transcoding, echo cancellation, and protocol translation. Adds latency to the pipeline.", domain: 2, exam: true },
  { term: "Speculative Execution", definition: "Starting LLM inference on partial ASR transcripts before the user finishes speaking, betting that the transcript won't change. Reduces latency when the bet is correct but wastes compute when the ASR revises its hypothesis.", domain: 2, exam: true },
  { term: "Latency Budget", definition: "The total allowable end-to-end latency divided across pipeline stages. For a 500ms target: ASR ~100ms, LLM ~250ms, TTS ~100ms, network ~50ms. Helps identify which stage to optimize when the budget is exceeded.", domain: 2, exam: false },
  { term: "AGC", full: "Automatic Gain Control", definition: "Signal processing that normalizes audio volume in real time — boosting quiet speech and attenuating loud speech. Ensures consistent input levels to the ASR regardless of microphone distance or speaker volume.", domain: 2, exam: false },
  { term: "RTP", full: "Real-time Transport Protocol", definition: "Protocol for delivering audio and video over IP networks. Carries the actual media data in WebRTC and SIP calls. Works alongside RTCP (control protocol) for quality monitoring and synchronization.", domain: 2, exam: false },
  { term: "Adaptive Bitrate", definition: "Dynamically adjusting audio codec bitrate based on network conditions. When bandwidth drops, lower the bitrate to maintain continuity at the cost of quality. Opus supports this natively, ranging from 6 to 510 kbps.", domain: 2, exam: false },

  // Domain 3 additions
  { term: "Slot-filling", definition: "A dialogue pattern where the agent collects required data fields (slots) from the user — like name, date, and location for a booking. Tracks which slots are filled vs. missing and prompts only for gaps. Supports out-of-order input.", domain: 3, exam: true },
  { term: "Disfluency Filtering", definition: "Preprocessing that strips filler words ('um', 'uh', 'like'), false starts, and repetitions from ASR output before passing to the LLM. Produces cleaner input without requiring users to speak unnaturally.", domain: 3, exam: true },
  { term: "Circuit Breaker Pattern", definition: "A server-side safety mechanism that halts repeated tool calls or API requests after a configurable limit. Prevents infinite loops in LLM function-calling by forcing the model to generate a user-facing response from available data.", domain: 3, exam: true },
  { term: "Rolling Summary", definition: "A context management strategy that compresses older conversation turns into a concise summary while keeping recent turns verbatim. Prevents context window overflow in long calls while preserving critical early information.", domain: 3, exam: true },
  { term: "Fan-out Pattern", definition: "An orchestration approach where multiple independent operations (RAG retrieval, API calls, database queries) execute in parallel, and results are assembled before a single LLM generation call. Minimizes total latency.", domain: 3, exam: false },
  { term: "Structured Output", definition: "Constraining LLM generation to produce valid JSON or other structured formats. Essential for function calling, entity extraction, and any pipeline step that needs machine-readable LLM output rather than free text.", domain: 3, exam: false },
  { term: "TTFT", full: "Time to First Token", definition: "The latency from sending a prompt to the LLM until the first output token is generated. Dominated by prompt processing time. Grows with conversation history length and system prompt size.", domain: 3, exam: false },

  // Domain 4 additions
  { term: "Compound Question", definition: "A user utterance containing multiple questions or requests ('What's the price, do you deliver, and is it in stock?'). Requires decomposition into individual queries with structured, verbally-marked responses.", domain: 4, exam: true },
  { term: "Context-sensitive Persona", definition: "Dynamically adjusting the agent's tone and communication style based on the nature of the interaction — warm and empathetic for complaints, professional and efficient for technical support.", domain: 4, exam: true },
  { term: "Urgency Detection", definition: "Identifying signals in user speech that indicate time-critical situations (medical emergencies, safety threats). Should trigger escalation protocols that override normal conversation flow.", domain: 4, exam: true },
  { term: "Verbal Marker", definition: "Phrases like 'Regarding your first question...', 'On pricing...', 'And about delivery...' that structure spoken responses. Help listeners track which part of a multi-part answer is being addressed.", domain: 4, exam: false },
  { term: "Silence Threshold", definition: "The duration of silence the system waits before concluding the user has finished speaking (end-of-utterance detection). Too short clips users mid-thought; too long creates awkward pauses.", domain: 4, exam: false },

  // Domain 5 additions
  { term: "BIPA", full: "Illinois Biometric Information Privacy Act", definition: "One of the strictest US biometric privacy laws. Covers voiceprints as biometric identifiers. Requires written consent before collection, a public retention/destruction policy, and provides a private right of action ($1,000-$5,000 per violation).", domain: 5, exam: true },
  { term: "CCPA", full: "California Consumer Privacy Act", definition: "California state privacy law giving residents rights over their personal data: right to know, delete, opt out of sale, and non-discrimination. Applies to voice recordings and transcripts containing personal information.", domain: 5, exam: true },
  { term: "DPA", full: "Data Processing Agreement", definition: "A legally binding contract between a data controller and a data processor (or sub-processor) that specifies how personal data is handled. Required under GDPR when using third-party services like cloud ASR providers.", domain: 5, exam: true },
  { term: "Sub-processor", definition: "A third party that processes personal data on behalf of a data processor. In voice AI, cloud ASR/TTS providers are sub-processors. Their data handling practices must be disclosed and governed by a DPA.", domain: 5, exam: true },
  { term: "Purpose Limitation", definition: "GDPR principle (Article 5(1)(b)) requiring that data collected for one purpose cannot be used for another without separate consent. Voice recordings collected for service delivery cannot be repurposed for model training without explicit, specific consent.", domain: 5, exam: true },
  { term: "Right of Publicity", definition: "Legal right to control commercial use of one's identity — including voice. Violated by unconsented voice cloning. Several US states have specific legislation (Tennessee ELVIS Act, California, Illinois BIPA).", domain: 5, exam: true },
  { term: "GDPR Article 22", definition: "Grants individuals the right not to be subject to decisions based solely on automated processing that produce legal or similarly significant effects. Relevant when voice AI makes consequential decisions (claim denials, credit decisions).", domain: 5, exam: true },
  { term: "Algorithmic Bias", definition: "Systematic discrimination in automated decision-making caused by biased training data or model design. In voice AI, can manifest as ASR accuracy disparities across accents or unfair automated decisions correlated with speaking patterns.", domain: 5, exam: false },
  { term: "Audio Watermarking", definition: "Embedding imperceptible signals into synthesized audio to identify it as AI-generated. Emerging requirement for synthetic media transparency. Helps detect deepfakes and comply with AI disclosure regulations.", exam: false },
  { term: "On-device ASR", definition: "Running speech recognition locally on the user's device rather than in the cloud. Eliminates network latency and keeps audio data private. Constrained by device compute (smaller models, lower accuracy).", exam: false },
  { term: "Synthetic Media", definition: "Any media (audio, video, images) generated or manipulated by AI. Voice cloning output is synthetic media. Subject to emerging regulations requiring disclosure and consent.", exam: false },
];

const QUESTIONS = [
  // ═══════════════════════════════════════════════════════════════════
  // DIFFICULTY 0 — BEGINNER (IDs 101–130)
  // ═══════════════════════════════════════════════════════════════════

  // DOMAIN 1 — Voice AI Fundamentals (101–106)
  {
    id: 101, domain: 1, difficulty: 0,
    question: "What does ASR stand for?",
    options: ["Automatic Speech Recognition", "Audio Stream Recorder", "Advanced Sound Rendering", "Analog Signal Receiver"],
    correct: 0,
    explanation: "ASR stands for Automatic Speech Recognition — the technology that converts spoken language into text. It's the foundation of most voice AI systems."
  },
  {
    id: 102, domain: 1, difficulty: 0,
    question: "What does TTS stand for?",
    options: ["Text-to-Speech", "Talk-to-System", "Transcribe-to-Script", "Transmit-to-Server"],
    correct: 0,
    explanation: "TTS stands for Text-to-Speech — technology that converts written text into spoken audio. It's how voice agents 'talk' to users."
  },
  {
    id: 103, domain: 1, difficulty: 0,
    question: "Which of these best describes a 'voice agent'?",
    options: ["An AI system that can hold spoken conversations with users", "A microphone used for voice recording", "A human call center operator", "A telephone switchboard"],
    correct: 0,
    explanation: "A voice agent is an AI system that conducts spoken conversations autonomously — it listens, understands, reasons, and responds with speech."
  },
  {
    id: 104, domain: 1, difficulty: 0,
    question: "In a voice AI system, which component converts the user's spoken words into text?",
    options: ["TTS (Text-to-Speech)", "LLM (Large Language Model)", "ASR (Automatic Speech Recognition)", "WebRTC"],
    correct: 2,
    explanation: "ASR (Automatic Speech Recognition) is the component that converts spoken audio into text. The text is then processed by an LLM, and the response is spoken aloud by TTS."
  },
  {
    id: 105, domain: 1, difficulty: 0,
    question: "What is the typical order of components in a standard voice AI pipeline?",
    options: ["TTS → LLM → ASR", "LLM → ASR → TTS", "ASR → LLM → TTS", "ASR → TTS → LLM"],
    correct: 2,
    explanation: "The standard cascaded voice pipeline is ASR → LLM → TTS: first transcribe the user's speech, then reason about a response with an LLM, then speak the response using TTS."
  },
  {
    id: 106, domain: 1, difficulty: 0,
    question: "What is 'natural language' in the context of voice AI?",
    options: ["The way humans naturally speak to each other, as opposed to rigid commands", "Programming code used to build voice systems", "A specific language like English or French", "Sound effects and music in an app"],
    correct: 0,
    explanation: "Natural language refers to the way humans normally speak — conversational, flexible, sometimes messy — as opposed to rigid menu commands. Voice AI aims to understand natural language rather than forcing users to memorize specific phrases."
  },

  // DOMAIN 2 — Real-Time Architecture & Pipelines (107–112)
  {
    id: 107, domain: 2, difficulty: 0,
    question: "What does 'latency' mean in a voice AI system?",
    options: ["The accuracy of the speech recognition", "The loudness of the audio output", "The delay between when you speak and when the agent responds", "The number of users on the system"],
    correct: 2,
    explanation: "Latency is the delay between user input and system response. In voice AI, it's typically measured from when you finish speaking to when you hear the agent's reply. Lower latency feels more natural."
  },
  {
    id: 108, domain: 2, difficulty: 0,
    question: "What is 'real-time' voice AI?",
    options: ["A system that records audio for later processing", "A system that only works during business hours", "A system that responds fast enough to feel like a live conversation", "A system that uses real human agents, not AI"],
    correct: 2,
    explanation: "Real-time voice AI responds quickly enough (typically under 1 second) to feel like a natural conversation. It's the opposite of batch processing, where audio is recorded and transcribed later."
  },
  {
    id: 109, domain: 2, difficulty: 0,
    question: "What is an audio codec?",
    options: ["A type of microphone", "A password for audio files", "A method for compressing and decompressing audio for storage or transmission", "A person who writes voice scripts"],
    correct: 2,
    explanation: "An audio codec (short for coder-decoder) is a technology that compresses audio for transmission and decompresses it for playback. Common voice codecs include Opus and G.711."
  },
  {
    id: 110, domain: 2, difficulty: 0,
    question: "What does 'barge-in' mean in a voice assistant?",
    options: ["When the user can interrupt the agent while it's speaking", "When the system crashes unexpectedly", "When multiple users join a call at the same time", "When the agent forgets the conversation history"],
    correct: 0,
    explanation: "Barge-in is the ability for a user to interrupt the voice agent mid-response. Without barge-in, users must wait for the agent to finish every sentence — which feels unnatural in conversation."
  },
  {
    id: 111, domain: 2, difficulty: 0,
    question: "Why does audio need to travel over a network in most voice AI systems?",
    options: ["Because AI models run in the cloud, not on the user's device", "Because audio files are too large to play locally", "Because networks make audio sound clearer", "Because local devices cannot record audio"],
    correct: 0,
    explanation: "Most voice AI processing (ASR, LLM, TTS) happens on cloud servers because the models are too large to run on phones or laptops efficiently. Audio is streamed to the cloud and the response is streamed back."
  },
  {
    id: 112, domain: 2, difficulty: 0,
    question: "What does 'streaming' mean in voice AI?",
    options: ["Listening to music through the app", "Broadcasting voice calls to multiple listeners", "Recording audio to a file on disk", "Processing audio as it arrives, piece by piece, rather than waiting for the whole recording"],
    correct: 3,
    explanation: "Streaming means processing audio incrementally as it arrives — like transcribing the beginning of a sentence before the speaker finishes. This is essential for low-latency real-time voice AI."
  },

  // DOMAIN 3 — LLM + Voice Orchestration (113–118)
  {
    id: 113, domain: 3, difficulty: 0,
    question: "What is an LLM (Large Language Model)?",
    options: ["A dictionary that stores word definitions", "A type of microphone used for voice recording", "An AI system trained on massive amounts of text that can understand and generate human-like language", "A programming language for building voice apps"],
    correct: 2,
    explanation: "An LLM is an AI system trained on huge amounts of text that can understand language, answer questions, and generate human-like responses. Examples include GPT, Claude, and Gemini. LLMs power the reasoning in voice agents."
  },
  {
    id: 114, domain: 3, difficulty: 0,
    question: "What is a 'prompt' in the context of an LLM?",
    options: ["The instruction or question given to the LLM to respond to", "The speed at which the LLM runs", "A type of error the LLM can produce", "The microphone used to speak to the LLM"],
    correct: 0,
    explanation: "A prompt is the text input you give an LLM — a question, instruction, or piece of context that the LLM responds to. In voice AI, the user's transcribed speech becomes part of the prompt."
  },
  {
    id: 115, domain: 3, difficulty: 0,
    question: "What does it mean when an AI 'hallucinates'?",
    options: ["The AI needs to be rebooted", "The AI plays audio without any input", "The AI generates information that sounds confident but is actually false or made up", "The AI refuses to respond to the user"],
    correct: 2,
    explanation: "Hallucination is when an AI generates plausible-sounding but factually wrong information. In voice AI this is especially dangerous because users can't easily fact-check what they hear in real time."
  },
  {
    id: 116, domain: 3, difficulty: 0,
    question: "What is a 'system prompt'?",
    options: ["A notification from the operating system", "A password prompt for logging into the system", "A button that starts the voice recording", "Instructions given to the LLM that define its role, personality, and rules"],
    correct: 3,
    explanation: "A system prompt is a set of instructions given to the LLM at the start of a conversation that defines its persona, tone, capabilities, and constraints. It's how you tell the AI 'you are a helpful customer support agent' or similar."
  },
  {
    id: 117, domain: 3, difficulty: 0,
    question: "What does a voice agent need in order to actually take actions like booking an appointment or checking an order?",
    options: ["Nothing — LLMs can book appointments directly", "A special microphone with an action button", "A human agent listening in the background", "A connection to real APIs and databases, often via 'function calling' or tool use"],
    correct: 3,
    explanation: "LLMs generate text but can't directly act on external systems. To book appointments, check orders, or do anything real-world, the voice agent needs to call APIs — usually through 'function calling' where the LLM requests specific actions."
  },
  {
    id: 118, domain: 3, difficulty: 0,
    question: "Why can't a voice agent remember things you said in a conversation you had yesterday (by default)?",
    options: ["Because AI systems legally cannot store any information", "Because voice can't be converted to memory", "Because remembering would be too slow", "Because the LLM doesn't have persistent memory across sessions unless the system is specifically designed to save and reload that history"],
    correct: 3,
    explanation: "By default, LLMs only see the current conversation's context. To remember things across sessions, the system has to explicitly save past conversation history and load it back in — this is called memory or persistence, and it has to be built in."
  },

  // DOMAIN 4 — Voice UX & Conversation Design (119–124)
  {
    id: 119, domain: 4, difficulty: 0,
    question: "What is a 'voice persona'?",
    options: ["The voice of a specific person, like a celebrity", "A legal document about voice rights", "The volume setting on a voice app", "The character, tone, and personality of a voice agent — how it 'presents itself' to users"],
    correct: 3,
    explanation: "A voice persona is the defined personality and communication style of a voice agent — its name, tone, vocabulary, level of formality. It's what makes the agent feel like a consistent 'character' rather than a random response generator."
  },
  {
    id: 120, domain: 4, difficulty: 0,
    question: "Why does designing voice interfaces require different thinking than designing visual interfaces?",
    options: ["Voice interfaces don't need any design", "Voice interfaces use the same design principles as websites", "Voice is only used by people who can't read", "Voice is ephemeral — users can't 'scroll back' to re-read what was said, so information must be chunked and paced differently"],
    correct: 3,
    explanation: "Voice is heard once and gone — users can't scroll back. This means responses must be shorter, information must be chunked into digestible pieces, and confirmations are more important because users can't re-read."
  },
  {
    id: 121, domain: 4, difficulty: 0,
    question: "What is 'turn-taking' in a voice conversation?",
    options: ["Rotating between different AI voices", "The mechanism that decides when the user should speak and when the agent should speak", "Switching between English and other languages", "Changing topics in a conversation"],
    correct: 1,
    explanation: "Turn-taking manages who speaks when in a conversation. The system needs to detect when the user has finished speaking (so it can respond) and when to stop speaking if the user wants to interrupt. Getting this wrong feels awkward and robotic."
  },
  {
    id: 122, domain: 4, difficulty: 0,
    question: "What is an IVR system?",
    options: ["Internet Voice Router", "Interactive Voice Response — the automated phone menus you hear when calling companies ('Press 1 for sales...')", "Integrated Video Recorder", "Internal Voice Recognition"],
    correct: 1,
    explanation: "IVR stands for Interactive Voice Response — the automated phone menu systems most people have experienced when calling customer service. Modern voice AI is replacing rigid IVR menus with natural conversation."
  },
  {
    id: 123, domain: 4, difficulty: 0,
    question: "Why does response speed matter so much in voice AI?",
    options: ["Because slower responses use more battery", "Because users only have a few seconds before their phone disconnects", "Because speed affects voice recognition accuracy", "Because long pauses feel unnatural in conversation and users think the system is broken"],
    correct: 3,
    explanation: "In natural conversation, people respond within a fraction of a second. Longer pauses feel like the system is broken or unresponsive. Voice AI targets sub-1-second end-to-end latency to feel natural."
  },
  {
    id: 124, domain: 4, difficulty: 0,
    question: "Why might a voice agent confirm important details back to the user, like 'You said Tuesday at 3pm, is that correct?'",
    options: ["To fill time while thinking", "Because speech recognition isn't perfect, and confirmation prevents costly errors before taking action", "Because users enjoy hearing their words repeated", "Because it's a legal requirement"],
    correct: 1,
    explanation: "Speech recognition makes mistakes, especially on names, dates, and numbers. Confirming critical details back to the user catches errors before the system takes action — essential for things like appointments, payments, and bookings."
  },

  // DOMAIN 5 — Enterprise, Compliance & Verticals (125–130)
  {
    id: 125, domain: 5, difficulty: 0,
    question: "What does PII stand for?",
    options: ["Public Information Index", "Personally Identifiable Information", "Private Internal Identity", "Primary Information Instance"],
    correct: 1,
    explanation: "PII stands for Personally Identifiable Information — any data that can identify a specific person, like name, address, phone number, or voice biometrics. Voice AI systems must handle PII carefully to comply with privacy laws."
  },
  {
    id: 126, domain: 5, difficulty: 0,
    question: "What is GDPR?",
    options: ["A type of voice codec", "A European Union regulation that governs how personal data (including voice recordings) must be handled", "A voice AI company", "An American privacy law"],
    correct: 1,
    explanation: "GDPR (General Data Protection Regulation) is the EU's main data protection law. It applies to voice recordings and transcripts and requires consent, purpose limitation, retention limits, and individual rights like deletion."
  },
  {
    id: 127, domain: 5, difficulty: 0,
    question: "What is HIPAA primarily concerned with?",
    options: ["Protecting US healthcare information and patient privacy", "Regulating banking transactions", "Setting standards for voice codec quality", "Licensing voice actors"],
    correct: 0,
    explanation: "HIPAA (Health Insurance Portability and Accountability Act) is the US law that protects health information. Voice AI systems used in healthcare must comply with HIPAA — including encrypting recordings, signing BAAs with vendors, and protecting patient data."
  },
  {
    id: 128, domain: 5, difficulty: 0,
    question: "Why do many voice systems announce 'This call may be recorded' at the beginning?",
    options: ["To be friendly and informative", "Because many jurisdictions legally require informing or getting consent from callers before recording", "Because recordings improve audio quality", "Because it's a marketing tactic"],
    correct: 1,
    explanation: "Recording laws vary by jurisdiction. Some places require informing the caller (one-party consent), others require everyone's explicit permission (two-party consent). Announcing recording up front addresses this legal requirement."
  },
  {
    id: 129, domain: 5, difficulty: 0,
    question: "Why is it risky to use a voice AI that provides medical or legal advice to consumers?",
    options: ["Voice AI cannot pronounce medical terms correctly", "AI can make mistakes (hallucinate) and giving wrong medical or legal advice can cause serious harm or create legal liability", "Medical and legal audio files are too large", "These topics don't work well with microphones"],
    correct: 1,
    explanation: "AI models can generate confident but wrong information. In high-stakes domains like medicine and law, this can cause real harm. Voice agents in these fields usually have strict guardrails and escalation to human professionals."
  },
  {
    id: 130, domain: 5, difficulty: 0,
    question: "What does it mean when a voice AI vendor is 'SOC 2 compliant'?",
    options: ["They only operate in specific countries", "They have been audited to verify they have proper security and privacy controls in place", "They use a specific type of voice codec", "Their AI has passed a Turing test"],
    correct: 1,
    explanation: "SOC 2 is a security audit standard that verifies a company has proper controls around data security, availability, processing integrity, confidentiality, and privacy. Enterprise customers often require SOC 2 compliance before using a vendor."
  },

  // ═══════════════════════════════════════════════════════════════════
  // DIFFICULTY 1 — FOUNDATIONS (IDs 1–40)
  // ═══════════════════════════════════════════════════════════════════

  // DOMAIN 1 — Voice AI Fundamentals
  {
    id: 1, domain: 1, difficulty: 1,
    question: "A healthcare startup is evaluating ASR providers for transcribing patient intake calls. Their primary concern is accuracy on medical terminology. Which metric should they prioritize?",
    options: ["Word Error Rate (WER) on domain-specific test sets", "Real-time factor (RTF)", "Mean Opinion Score (MOS)", "Time To First Byte (TTFB)"],
    correct: 0,
    explanation: "WER on domain-specific (medical) test sets directly measures transcription accuracy for your use case. RTF measures speed, MOS measures speech quality, and TTFB measures response latency — none of which assess accuracy on medical vocabulary."
  },
  {
    id: 2, domain: 1, difficulty: 1,
    question: "Which TTS architecture consistently produces the most natural-sounding speech in modern production systems?",
    options: ["Concatenative synthesis", "Neural TTS (transformer/diffusion-based)", "Formant synthesis", "Rule-based phoneme synthesis"],
    correct: 1,
    explanation: "Neural TTS using transformers or diffusion models achieves the highest naturalness scores. Concatenative synthesis stitches audio recordings and sounds robotic at boundaries. Formant and rule-based synthesis are older approaches with significantly lower quality."
  },
  {
    id: 3, domain: 1, difficulty: 1,
    question: "A voice agent has 450ms end-to-end latency. In a typical cascaded pipeline (ASR → LLM → TTS), which component contributes the MOST to this latency?",
    options: ["TTS rendering", "LLM inference", "ASR processing", "WebRTC transport overhead"],
    correct: 1,
    explanation: "LLM inference is typically the dominant latency factor (200–400ms) in cascaded voice pipelines. ASR adds 50–150ms and TTS 50–200ms. WebRTC transport adds minimal overhead in well-configured infrastructure."
  },
  {
    id: 4, domain: 1, difficulty: 1,
    question: "What does MOS (Mean Opinion Score) measure in voice AI evaluation?",
    options: ["Model accuracy on standard benchmark datasets", "Perceived speech quality rated on a 1–5 scale", "Word error rate under noisy conditions", "Mean latency of streaming speech responses"],
    correct: 1,
    explanation: "MOS is a subjective quality metric where human listeners rate speech naturalness and intelligibility on a scale of 1–5. It measures perceptual quality, not accuracy. WER measures transcription accuracy."
  },
  {
    id: 5, domain: 1, difficulty: 1,
    question: "Speaker diarization solves which specific problem in voice AI?",
    options: ["Identifying who spoke when in a multi-speaker recording", "Reducing background noise in audio streams", "Separating overlapping simultaneous speech", "Adapting ASR models to new accents"],
    correct: 0,
    explanation: "Diarization answers 'who spoke when' — segmenting audio by speaker identity. Noise reduction, source separation, and accent adaptation are distinct tasks requiring different techniques."
  },
  {
    id: 6, domain: 1, difficulty: 1,
    question: "A production voice app has 8% WER in testing but 24% WER in production. The most likely cause is:",
    options: ["The ASR model overfitted to training data", "Domain mismatch between the test corpus and real user speech", "Network latency degrading audio quality", "TTS artifacts being fed back into the ASR input"],
    correct: 1,
    explanation: "A large gap between test and production WER almost always indicates the test set doesn't represent real users — different accents, background noise, domain-specific vocabulary, or speaking styles not covered during evaluation."
  },
  {
    id: 7, domain: 1, difficulty: 1,
    question: "Which technique allows a TTS system to maintain consistent voice identity while varying emotional tone?",
    options: ["Voice conversion post-processing", "A shared speaker embedding with variable style/prosody control", "Prosody transfer cloned from a source recording", "Phoneme blending across multiple reference speakers"],
    correct: 1,
    explanation: "Speaker embeddings encode voice identity independently of speaking style or emotion. Keeping the speaker embedding fixed while varying style/prosody parameters preserves identity across emotional tones — the core approach in modern controllable TTS."
  },
  {
    id: 8, domain: 1, difficulty: 1,
    question: "Streaming ASR differs from batch ASR primarily in that:",
    options: ["Streaming ASR processes audio in real-time as it is spoken; batch waits for the full utterance", "Streaming ASR uses less compute per request", "Streaming ASR only works for utterances under 30 seconds", "Batch ASR always produces higher accuracy than streaming"],
    correct: 0,
    explanation: "Streaming (online) ASR produces partial transcripts incrementally as audio arrives, enabling lower perceived latency. Batch ASR waits for the complete audio, which can be more accurate but adds unacceptable delay for interactive voice applications."
  },
  // DOMAIN 2 — Real-Time Architecture & Pipelines
  {
    id: 9, domain: 2, difficulty: 1,
    question: "In a real-time voice agent, 'barge-in' handling refers to:",
    options: ["Detecting when a user interrupts the agent mid-speech and stopping TTS playback", "A security mechanism preventing unauthorized audio injection", "Buffering user audio during active TTS output", "Routing audio streams between multiple ASR providers"],
    correct: 0,
    explanation: "Barge-in detects user speech while the agent is talking, stops TTS playback, and processes the new input. This is essential for natural conversation — without it, users must wait for the agent to finish every sentence before speaking."
  },
  {
    id: 10, domain: 2, difficulty: 1,
    question: "For building a real-time bidirectional voice agent, which transport protocol is most appropriate?",
    options: ["HTTP/2 streaming", "WebSockets with chunked audio encoding", "WebRTC", "RTMP"],
    correct: 2,
    explanation: "WebRTC is purpose-built for real-time peer-to-peer audio with built-in jitter buffering, adaptive bitrate, codec negotiation, and sub-200ms latency. RTMP is designed for one-way media broadcasting; WebSockets work but lack WebRTC's audio-specific optimizations."
  },
  {
    id: 11, domain: 2, difficulty: 1,
    question: "LiveKit is best described as:",
    options: ["An ASR provider with real-time transcription APIs", "An LLM serving platform optimized for voice workloads", "A voice agent framework with built-in conversation management", "A WebRTC infrastructure platform for building real-time audio/video applications"],
    correct: 3,
    explanation: "LiveKit provides WebRTC infrastructure — rooms, tracks, signaling, SFU — that voice AI applications build on top of. It is not an ASR provider, LLM platform, or agent framework, though agent SDKs built on LiveKit exist."
  },
  {
    id: 12, domain: 2, difficulty: 1,
    question: "A voice agent consistently cuts off users before they finish speaking. The most targeted fix is:",
    options: ["Reducing the TTS speaking rate", "Increasing the end-of-utterance silence detection threshold", "Switching to a lower-latency ASR provider", "Adding an explicit confirmation step before every agent response"],
    correct: 1,
    explanation: "If the agent fires before users finish, the VAD/EOU silence threshold is too short. Increasing it gives users more time for natural mid-sentence pauses. Faster ASR or TTS rate changes don't address the premature triggering problem."
  },
  {
    id: 13, domain: 2, difficulty: 1,
    question: "What is the primary advantage of a cascaded voice pipeline (ASR → LLM → TTS) over a native voice-to-voice model?",
    options: ["Independent component control, replaceability, and easier debugging", "Lower end-to-end latency", "Better emotional expressivity in output", "No dependency on text as an intermediate representation"],
    correct: 0,
    explanation: "Cascaded pipelines let you swap best-in-class components independently, inspect intermediate text representations, and debug individual stages. Native V2V models are harder to control, audit, or improve in targeted ways."
  },
  {
    id: 14, domain: 2, difficulty: 1,
    question: "Jitter buffering in WebRTC primarily addresses:",
    options: ["Echo cancellation between speaker and microphone", "Smoothing variable packet arrival times to prevent choppy audio", "Compressing audio for reduced bandwidth usage", "End-to-end encryption of audio streams"],
    correct: 1,
    explanation: "Network jitter causes audio packets to arrive at irregular intervals. The jitter buffer holds packets and releases them at a steady rate, preventing audio dropouts and choppiness at the cost of a small, controlled increase in latency."
  },
  {
    id: 15, domain: 2, difficulty: 1,
    question: "When feeding streaming LLM output directly to a TTS engine, the main risk is:",
    options: ["Garbled audio from rendering incomplete prosodic units mid-sentence", "Increased total token consumption from streaming", "Loss of conversation context in earlier turns", "WebRTC incompatibility with variable-length audio chunks"],
    correct: 0,
    explanation: "TTS engines need complete sentences or clauses to generate natural prosody. Feeding raw token streams produces choppy, unnaturally pitched output. Sentence-boundary detection is required to chunk LLM output into speakable units before TTS rendering."
  },
  {
    id: 16, domain: 2, difficulty: 1,
    question: "In a voice pipeline, 'first token latency' (or 'time to first audio') measures:",
    options: ["Time from session establishment to first audio sample played", "Time for ASR to produce its first partial transcript token", "Time from end of user speech to the first TTS audio playing", "Time for the first WebRTC negotiation packet to arrive"],
    correct: 2,
    explanation: "First audio latency = the perceived response gap from when the user stops speaking to when they hear the agent's first words. This is the key UX metric for voice AI — values below 500ms feel natural; above 1000ms feels broken."
  },
  {
    id: 17, domain: 2, difficulty: 1,
    question: "At 10,000 concurrent voice sessions, which pipeline component is most likely to become the scaling bottleneck?",
    options: ["WebRTC signaling server", "Neural TTS rendering (GPU inference)", "DNS resolution", "Audio codec transcoding"],
    correct: 1,
    explanation: "Neural TTS inference is GPU-intensive — each request requires a forward pass through a large model. WebRTC signaling and codec transcoding are lightweight and scale horizontally with ease. TTS infrastructure is the most expensive and complex component to scale."
  },
  // DOMAIN 3 — LLM + Voice Orchestration
  {
    id: 18, domain: 3, difficulty: 1,
    question: "A voice agent needs to book a restaurant reservation while in conversation with a user. Which architecture best enables this?",
    options: ["A single-prompt LLM that generates all spoken responses inline", "A rule-based dialogue tree with hard-coded API integrations", "A fine-tuned LLM with booking knowledge embedded in its weights", "An LLM with function/tool calling connected to a booking API"],
    correct: 3,
    explanation: "Function/tool calling lets the LLM dynamically invoke booking APIs based on conversation context. Rule-based trees are brittle; fine-tuned weights go stale and can't call live systems; single-prompt LLMs can't take real-world actions."
  },
  {
    id: 19, domain: 3, difficulty: 1,
    question: "Why is context window management especially critical in voice AI compared to text chat?",
    options: ["Voice models have fundamentally smaller context windows", "Token costs are significantly higher for voice applications", "Spoken conversations are longer and users cannot scroll back to reference earlier content", "Voice requires maintaining audio state between turns in the context"],
    correct: 2,
    explanation: "Unlike text chat where users can scroll up, voice is ephemeral — users can't review what was said. The agent must maintain coherent context across a long conversation entirely within the window. Long calls risk losing critical early context."
  },
  {
    id: 20, domain: 3, difficulty: 1,
    question: "Which approach is most effective for maintaining a consistent voice persona across a long conversation?",
    options: ["A detailed system prompt defining character, tone, vocabulary, and example phrasings", "Injecting persona instructions as a user message at every turn", "Fine-tuning the base LLM on persona-specific dialogue data", "Post-processing TTS output with a voice style transfer model"],
    correct: 0,
    explanation: "A well-crafted system prompt is the most practical, cost-effective, and consistent way to maintain persona. Fine-tuning is expensive and less flexible. Injecting per-turn wastes context. TTS post-processing affects voice style but not language/personality."
  },
  {
    id: 21, domain: 3, difficulty: 1,
    question: "A voice agent for a medical clinic must never provide clinical advice. The best implementation of this constraint is:",
    options: ["A post-processing output filter that detects medical advice in responses", "A whitelisted response database for all possible queries", "System prompt guardrails with explicit constraints and refusal instructions", "Human review queue for every response before TTS playback"],
    correct: 2,
    explanation: "System-level guardrails with clear prohibitions and refusal behavior are the correct architectural layer for hard constraints. Post-processing filters can miss nuanced cases; whitelisting is too rigid; human review is too slow for real-time voice."
  },
  {
    id: 22, domain: 3, difficulty: 1,
    question: "RAG (Retrieval-Augmented Generation) in a voice agent is most valuable for:",
    options: ["Reducing TTS latency by pre-caching likely responses", "Grounding the agent in current, domain-specific knowledge without retraining", "Improving ASR accuracy on rare product names", "Maintaining conversation history across disconnected sessions"],
    correct: 1,
    explanation: "RAG lets voice agents retrieve current product info, FAQs, or policy docs dynamically at query time. This avoids stale knowledge in model weights and is far cheaper than continuous fine-tuning. ASR accuracy and conversation memory require different solutions."
  },
  {
    id: 23, domain: 3, difficulty: 1,
    question: "In a multi-agent voice architecture, the 'orchestrator' agent is primarily responsible for:",
    options: ["Providing ASR transcription services to all sub-agents", "Managing the WebRTC session lifecycle and audio routing", "Routing user requests to specialized sub-agents and synthesizing final responses", "Rendering TTS output on behalf of all agents in the system"],
    correct: 2,
    explanation: "The orchestrator manages task delegation, context sharing between agents, and assembling coherent responses from sub-agent outputs. Audio infrastructure (WebRTC, ASR, TTS) is separate from orchestration logic."
  },
  {
    id: 24, domain: 3, difficulty: 1,
    question: "A voice agent should speak formally with enterprise users and casually with consumers. The cleanest implementation is:",
    options: ["Train two separate fine-tuned models", "Post-process TTS output to adjust formality level", "Use separate ASR models with different language model biases per persona", "Maintain two system prompt variants, selecting based on session context at initialization"],
    correct: 3,
    explanation: "Prompt-level persona control is lightweight, maintainable, and effective. Two system prompts selected at session start is clean and scalable. Separate model training is expensive; TTS post-processing doesn't control linguistic formality; ASR selection is irrelevant."
  },
  {
    id: 25, domain: 3, difficulty: 1,
    question: "Intent detection in a voice agent pipeline is best described as:",
    options: ["Detecting when the user intends to end the call", "Classifying user utterances into actionable categories to route to the correct handler", "Measuring ASR confidence that a transcript is accurate", "Identifying the language spoken by the user"],
    correct: 1,
    explanation: "Intent detection classifies what the user wants to do ('book a flight', 'check account balance') and routes to the appropriate dialogue path or API handler. End-of-call detection is a specific subset; language ID and ASR confidence are separate signals."
  },
  {
    id: 26, domain: 3, difficulty: 1,
    question: "Which describes the key challenge of 'hallucination' in voice AI agents specifically?",
    options: ["ASR producing incorrect transcripts due to audio noise", "TTS producing audio artifacts on low-confidence tokens", "WebRTC packet loss causing audio corruption", "LLM generating confident but factually incorrect spoken information that users cannot easily verify in real-time"],
    correct: 3,
    explanation: "In text, users can re-read and fact-check AI responses. In voice, hallucinated information — wrong hours, prices, instructions — is heard once and acted upon. This makes hallucination disproportionately dangerous in voice AI compared to text."
  },
  // DOMAIN 4 — Voice UX & Conversation Design
  {
    id: 27, domain: 4, difficulty: 1,
    question: "A voice customer support agent receives high complaint rates that it 'doesn't understand' users. The FIRST audit step should be:",
    options: ["Inspecting actual ASR transcripts to identify recognition failure patterns", "Reviewing TTS voice quality and speaking rate", "Upgrading to a newer LLM model version", "Measuring end-to-end network latency metrics"],
    correct: 0,
    explanation: "You can't fix what you can't diagnose. Auditing ASR transcripts reveals whether failures are in speech recognition, intent understanding, or response generation — three very different problems requiring different fixes."
  },
  {
    id: 28, domain: 4, difficulty: 1,
    question: "Which confirmation strategy is most appropriate for a high-stakes voice transaction (e.g., initiating a bank transfer)?",
    options: ["Implicit confirmation — proceed without verbal confirmation to minimize friction", "No agent-side confirmation — rely on downstream systems to catch errors", "Single explicit confirmation repeating key transaction details ('Send €5,000 to Marie — confirm?')", "Triple confirmation at each step to maximize certainty"],
    correct: 2,
    explanation: "High-stakes transactions require exactly one clear explicit confirmation with all key details repeated. Implicit confirmation is dangerous; triple confirmation creates excessive friction; no confirmation exposes users to costly errors."
  },
  {
    id: 29, domain: 4, difficulty: 1,
    question: "An agent repeatedly asks the same clarifying question even after the user has answered it. This failure is best categorized as:",
    options: ["Appropriate confirmation strategy", "Barge-in detection failure", "Insufficient ASR confidence thresholds", "Poor context retention causing repetitive re-prompting"],
    correct: 3,
    explanation: "A well-designed agent tracks collected information in dialogue state and only asks for missing fields. Repeating answered questions indicates broken slot-filling or context management, not a recognition or barge-in issue."
  },
  {
    id: 30, domain: 4, difficulty: 1,
    question: "In conversation design, 'error recovery' primarily refers to:",
    options: ["Gracefully handling misunderstandings and guiding users back on-track with targeted re-prompts", "Restarting a failed WebRTC audio session", "Rolling back a failed external API call during a transaction", "Re-running ASR inference on a low-confidence transcript"],
    correct: 0,
    explanation: "Error recovery handles NLU failures through graceful, context-aware re-prompts rather than dead ends or system errors. E.g., 'I didn't quite get that — were you looking to cancel or change your booking?' keeps users productive."
  },
  {
    id: 31, domain: 4, difficulty: 1,
    question: "What is the 'Wizard of Oz' (WoZ) method in voice UX research?",
    options: ["A/B testing two different TTS voice profiles with real users", "Testing a fully automated system against a benchmark conversation corpus", "A human secretly playing the agent's role to validate conversation design before engineering", "Using a competitor's voice product to baseline your UX against"],
    correct: 2,
    explanation: "WoZ lets teams validate conversation flows and surface design failures with a human impersonating the AI, before any model or pipeline is built. It's the cheapest and fastest way to test voice UX assumptions."
  },
  {
    id: 32, domain: 4, difficulty: 1,
    question: "A voice assistant persona is BEST defined as:",
    options: ["The LLM model and version powering the agent", "The complete set of intents and tasks the agent can handle", "The retry and fallback policy for failed API calls", "The agent's name, voice characteristics, tone, and personality traits"],
    correct: 3,
    explanation: "Persona is the character — how the agent presents itself, speaks, and relates to users. It's distinct from capability (what it can do) and from technical implementation (which model or pipeline)."
  },
  {
    id: 33, domain: 4, difficulty: 1,
    question: "Which accessibility concern is most critical in voice AI product design?",
    options: ["Supporting keyboard navigation alongside voice input", "Providing real-time visual captions alongside audio output", "Minimizing stored audio data for privacy compliance", "Designing ASR systems that work accurately across diverse accents and speech patterns"],
    correct: 3,
    explanation: "Voice interfaces that only work well for dominant accents or fluent speakers exclude large user populations. ASR trained on limited diversity creates systemic access barriers — the most fundamental voice AI accessibility issue."
  },
  {
    id: 34, domain: 4, difficulty: 1,
    question: "For a voice IVR, what speaking rate is generally recommended for highest comprehension?",
    options: ["180–200 WPM (match natural conversation pace)", "120–130 WPM (slow and deliberate)", "150–170 WPM (slightly slower than natural speech for clarity)", "220+ WPM (fast to reduce handle time)"],
    correct: 2,
    explanation: "IVR voices typically perform best at 150–170 WPM — marginally slower than natural conversation (160–180 WPM) to aid comprehension over compressed telephone audio. Too slow sounds robotic; too fast causes listener errors."
  },
  // DOMAIN 5 — Enterprise, Compliance & Verticals
  {
    id: 35, domain: 5, difficulty: 1,
    question: "A voice AI deployed in a US hospital to collect patient symptoms and triage information must comply with:",
    options: ["PCI DSS", "SOC 2 Type II only", "HIPAA", "GDPR only"],
    correct: 2,
    explanation: "Any system handling Protected Health Information (PHI) in a US healthcare context must comply with HIPAA. SOC 2 is a security certification, not a healthcare regulation. GDPR applies to EU data subjects; PCI DSS governs payment card data."
  },
  {
    id: 36, domain: 5, difficulty: 1,
    question: "In voice AI, which of the following is classified as PII requiring specific data protection?",
    options: ["Voice biometrics (voice prints) and raw audio recordings", "Anonymized system performance metrics", "Aggregated ASR error rates across sessions", "Model inference latency measurements"],
    correct: 0,
    explanation: "Voice prints are biometric PII under GDPR, CCPA, and BIPA. Raw audio recordings frequently contain names, financial details, medical information, and other sensitive data. Both require explicit handling policies, consent mechanisms, and access controls."
  },
  {
    id: 37, domain: 5, difficulty: 1,
    question: "Under GDPR, the minimum required practice when storing voice call recordings for quality assurance is:",
    options: ["Encrypting all recordings at rest with AES-256", "Anonymizing all audio files within 24 hours of capture", "Storing data exclusively on EU-based servers", "Informing users and obtaining lawful consent before recording, with defined retention limits"],
    correct: 3,
    explanation: "GDPR requires a lawful basis for processing (typically consent for optional QA recordings), purpose limitation, and defined retention periods. Encryption is best practice but not the minimum legal requirement. Server location matters but doesn't substitute for lawful basis."
  },
  {
    id: 38, domain: 5, difficulty: 1,
    question: "Voice cloning someone's voice without their consent primarily raises which legal concern?",
    options: ["Patent infringement on voice synthesis technology", "Copyright of the original vocal performance", "Right of publicity and potential identity fraud", "ASR model licensing violations"],
    correct: 2,
    explanation: "Unconsented voice cloning violates the right of publicity (using someone's likeness without permission) and may constitute identity fraud or defamation. Several US states (including Illinois, California) have specific biometric/voice cloning legislation."
  },
  {
    id: 39, domain: 5, difficulty: 1,
    question: "A voice AI handles calls in English and Spanish. The recommended architecture is:",
    options: ["A single ASR model that auto-detects language and switches vocabulary mid-call", "English-only ASR with real-time Spanish translation post-processing", "A single multilingual LLM handling all languages without language-specific ASR", "Language detection at session start, routing to language-specific ASR and TTS models"],
    correct: 3,
    explanation: "Best practice is early language detection routing to optimized monolingual models per language. Mid-call language switching causes recognition errors; translation adds latency and loses nuance; relying on LLM alone without language-specific ASR degrades recognition quality."
  },
  {
    id: 40, domain: 5, difficulty: 1,
    question: "In EU financial services, which regulation most directly governs the recording and retention of telephone conversations involving investment advice?",
    options: ["GDPR (General Data Protection Regulation)", "CCPA (California Consumer Privacy Act)", "ISO 27001 information security standard", "MiFID II (Markets in Financial Instruments Directive)"],
    correct: 3,
    explanation: "MiFID II Article 16 requires investment firms to record and retain all telephone communications related to investment advice, reception, and transmission of orders. GDPR governs data protection broadly but doesn't mandate recording. ISO 27001 is a security framework, not a recording obligation."
  },

  // ═══════════════════════════════════════════════════════════════════
  // DIFFICULTY 2 — INTERMEDIATE (IDs 41–70)
  // ═══════════════════════════════════════════════════════════════════

  // DOMAIN 1 — Voice AI Fundamentals (41–46)
  {
    id: 41, domain: 1, difficulty: 2,
    question: "Your ASR system shows 6% WER on clean audio but 22% WER on calls from users in noisy environments. Which approach will yield the largest accuracy improvement?",
    options: ["Fine-tuning the acoustic model on noisy audio data augmented with realistic background noise", "Increasing the language model's n-gram order", "Switching from streaming to batch ASR mode", "Increasing the audio sample rate from 16kHz to 48kHz"],
    correct: 0,
    explanation: "The WER gap between clean and noisy conditions points to acoustic model weakness on noisy input. Fine-tuning with noise-augmented data (adding babble, traffic, music) directly addresses this. Higher sample rates don't help telephony (8kHz bandwidth); batch mode adds latency without addressing noise robustness."
  },
  {
    id: 42, domain: 1, difficulty: 2,
    question: "A voice cloning system produces speech that sounds like the target speaker but with flat, monotone delivery. The most likely deficiency is in:",
    options: ["Speaker embedding extraction — the voice identity is not captured accurately", "Phoneme prediction — the model is generating incorrect sound sequences", "Prosody modeling — the system fails to reproduce natural rhythm, stress, and intonation patterns", "Vocoder quality — the neural vocoder introduces audio artifacts"],
    correct: 2,
    explanation: "If the voice identity is correct but delivery is flat, the speaker embedding is working but prosody modeling is insufficient. Prosody (rhythm, stress, intonation) is what makes speech expressive. Modern TTS systems need explicit prosody conditioning or reference audio to produce natural variation."
  },
  {
    id: 43, domain: 1, difficulty: 2,
    question: "You need to evaluate a TTS system for a customer service application. MOS testing with 50 listeners gives a score of 4.2. A competing system scores 4.1. What is the correct interpretation?",
    options: ["System A is definitively better since it scores higher", "The difference is likely not statistically significant — you need confidence intervals and a significance test before drawing conclusions", "MOS is unreliable for comparing systems within 0.5 points of each other", "You should switch to WER testing since MOS is subjective"],
    correct: 1,
    explanation: "A 0.1 MOS difference is within typical inter-rater variability. Without confidence intervals (usually via bootstrap or ANOVA) and statistical significance testing, this difference cannot be considered meaningful. MOS is valid but requires proper statistical analysis to compare systems."
  },
  {
    id: 44, domain: 1, difficulty: 2,
    question: "An ASR system uses CTC (Connectionist Temporal Classification) decoding. What is the primary limitation of CTC compared to attention-based encoder-decoder models?",
    options: ["CTC cannot process streaming audio input", "CTC assumes output tokens are conditionally independent, making it weaker at modeling language-level dependencies", "CTC requires significantly more training data than attention models", "CTC only works with English-language audio"],
    correct: 1,
    explanation: "CTC's conditional independence assumption means each output token is predicted independently given the input, without directly conditioning on previously emitted tokens. This makes CTC weaker at modeling linguistic context compared to attention-based or transducer models that explicitly condition on output history."
  },
  {
    id: 45, domain: 1, difficulty: 2,
    question: "A voice agent processes calls at 8kHz sample rate (telephony standard). A team proposes upgrading to 16kHz to improve ASR accuracy. What is the expected impact?",
    options: ["Significant accuracy improvement because higher sample rates always improve ASR", "The system will break because ASR models are trained on specific sample rates", "Minimal improvement because telephone audio is band-limited to ~3.4kHz regardless of the digital sample rate", "Accuracy will decrease because the model will process more noise in higher frequency bands"],
    correct: 2,
    explanation: "Telephone networks (PSTN) band-limit audio to approximately 300Hz-3.4kHz. Upsampling to 16kHz creates a higher sample rate file but cannot recover frequency information that was never captured by the telephone network. The improvement from resampling already band-limited audio is negligible."
  },
  {
    id: 46, domain: 1, difficulty: 2,
    question: "Your production ASR model handles English well but struggles with code-switching users who mix English and Hindi within the same sentence. The best approach is:",
    options: ["Run two separate ASR models in parallel and merge their outputs", "Post-process the English ASR output with a translation model to handle Hindi segments", "Detect language per-utterance and route to the appropriate monolingual model", "Use a multilingual ASR model specifically trained on code-switched speech data"],
    correct: 3,
    explanation: "Code-switching (mixing languages within a sentence) defeats per-utterance language routing because the switch happens mid-sentence. A multilingual model trained on code-switched data learns to handle transitions between languages naturally. Parallel models create alignment problems; translation post-processing destroys the original intent."
  },

  // DOMAIN 2 — Real-Time Architecture & Pipelines (47–52)
  {
    id: 47, domain: 2, difficulty: 2,
    question: "Your voice agent uses WebRTC but 15% of users behind corporate firewalls experience connection failures. The most effective infrastructure addition is:",
    options: ["Adding more STUN servers in different geographic regions", "Switching from WebRTC to WebSocket-based audio transport", "Deploying TURN relay servers to route media through when direct peer-to-peer connections fail", "Requiring users to configure their firewall to allow UDP traffic"],
    correct: 2,
    explanation: "Corporate firewalls often block UDP and restrict NAT traversal, causing direct peer-to-peer (STUN-based) connections to fail. TURN servers relay media through an intermediary that uses standard ports, enabling connectivity through restrictive firewalls. More STUN servers won't help if the firewall blocks direct connections entirely."
  },
  {
    id: 48, domain: 2, difficulty: 2,
    question: "A voice pipeline streams LLM tokens to TTS but users report the agent sounds choppy and unnatural. The audio itself has no artifacts. The most likely cause and fix is:",
    options: ["LLM tokens are being sent to TTS one-by-one instead of being buffered into sentence or clause boundaries before rendering", "The TTS model quality is too low — upgrade to a better TTS provider", "WebRTC jitter buffer is too small — increase buffer size", "The audio codec bitrate is too low for speech quality"],
    correct: 0,
    explanation: "TTS engines need complete prosodic units (sentences or clauses) to generate natural intonation. Feeding individual tokens produces speech with incorrect stress, pitch, and rhythm because the TTS cannot plan prosody for an incomplete thought. The fix is sentence-boundary buffering between LLM output and TTS input."
  },
  {
    id: 49, domain: 2, difficulty: 2,
    question: "You are designing a voice agent that must support 5,000 concurrent calls with sub-500ms end-to-end latency. Which architectural decision has the most impact on meeting both requirements simultaneously?",
    options: ["Choosing the fastest available LLM regardless of output quality", "Running all pipeline stages on a single server per session to eliminate network hops", "Using WebSockets instead of WebRTC to reduce protocol overhead", "Co-locating ASR, LLM, and TTS services in the same data center region with GPU-accelerated TTS inference pools"],
    correct: 3,
    explanation: "Co-location eliminates inter-region network latency between pipeline stages (which can add 50-200ms per hop), and GPU pools for TTS address the scaling bottleneck. A single server per session doesn't scale to 5,000 calls. WebSocket vs WebRTC doesn't meaningfully affect pipeline latency. Choosing the fastest LLM without quality consideration misses the real constraint."
  },
  {
    id: 50, domain: 2, difficulty: 2,
    question: "Your voice agent works well on Wi-Fi but users on cellular networks report frequent audio dropouts lasting 200-500ms. The most effective mitigation is:",
    options: ["Switching to a higher-bitrate audio codec for better error resilience", "Implementing Forward Error Correction (FEC) and adaptive jitter buffering that adjusts to network conditions", "Reducing the TTS speaking rate to give the network more time to deliver packets", "Switching from UDP to TCP transport for guaranteed delivery"],
    correct: 1,
    explanation: "Cellular networks have variable latency and packet loss. FEC adds redundancy so lost packets can be reconstructed, and adaptive jitter buffers dynamically adjust their size based on current network conditions. TCP's retransmission adds unacceptable latency for real-time audio. Higher bitrate increases bandwidth demand, worsening the problem."
  },
  {
    id: 51, domain: 2, difficulty: 2,
    question: "In a voice pipeline, you notice that ASR produces a final transcript 150ms after the user stops speaking, but the LLM doesn't begin generating until 400ms after that. Where is the 400ms gap most likely coming from?",
    options: ["Network latency between the ASR service and the LLM service", "WebRTC renegotiation happening between turns", "TTS initialization overhead before it can accept LLM output", "The LLM's time-to-first-token (TTFT) including prompt processing of conversation history and system prompt"],
    correct: 3,
    explanation: "The gap between receiving the ASR transcript and the LLM starting to generate is dominated by prompt processing — the LLM must process the system prompt, conversation history, and new user input before emitting the first token. This TTFT grows with conversation length. Network latency is typically under 50ms within a region."
  },
  {
    id: 52, domain: 2, difficulty: 2,
    question: "A team is deciding between Opus and G.711 codecs for their telephony voice agent. The key trade-off is:",
    options: ["Opus provides better quality at lower bitrates and adaptive bandwidth, but G.711 has universal PSTN compatibility without transcoding", "G.711 always sounds better than Opus for voice content", "Opus is proprietary and requires licensing, while G.711 is free", "G.711 supports wideband audio while Opus is limited to narrowband"],
    correct: 0,
    explanation: "Opus is technically superior — it adapts bitrate dynamically and produces better quality at lower bandwidths. However, G.711 (a-law/mu-law) is the native PSTN codec. Using Opus with telephony requires transcoding, adding latency and potential quality loss. For pure telephony deployments, G.711 avoids this overhead. Opus is open-source, not proprietary."
  },

  // DOMAIN 3 — LLM + Voice Orchestration (53–58)
  {
    id: 53, domain: 3, difficulty: 2,
    question: "A voice agent's RAG pipeline retrieves relevant documents but the agent still gives incorrect answers. The most likely failure point is:",
    options: ["The embedding model is too small to capture semantic meaning", "The retrieved documents are relevant but the LLM is not properly grounded — it generates from its parametric memory instead of the retrieved context", "The vector database is returning too many results, overwhelming the context", "The TTS system is misrendering the correct LLM output"],
    correct: 1,
    explanation: "A common RAG failure mode is the LLM ignoring retrieved context and generating from its own training knowledge. This happens when the system prompt doesn't strongly instruct the LLM to prefer retrieved context, or when retrieved passages are placed too far from the query in the prompt. The fix is prompt engineering that explicitly prioritizes retrieved context."
  },
  {
    id: 54, domain: 3, difficulty: 2,
    question: "Your voice agent handles 30-minute customer support calls. After ~15 minutes, users report the agent 'forgets' information from earlier in the conversation. The best mitigation strategy is:",
    options: ["Upgrading to an LLM with a larger context window", "Storing the entire transcript in an external database and querying it each turn", "Implementing a rolling summary that condenses older conversation history into a compact representation while keeping recent turns verbatim", "Reducing the system prompt length to free up context window space"],
    correct: 2,
    explanation: "Rolling summarization compresses older turns into a concise summary while keeping recent exchanges in full. This preserves critical early context within the window limit. Simply using a larger window is expensive and still has limits. Querying a database each turn adds latency and doesn't help the LLM reason about conversation flow."
  },
  {
    id: 55, domain: 3, difficulty: 2,
    question: "A voice agent uses function calling to check order status. The LLM occasionally calls the function with hallucinated order IDs that don't exist. The most robust fix is:",
    options: ["Adding function-level input validation that checks the order ID format and existence before execution, with a graceful error message back to the user", "Fine-tuning the LLM to never hallucinate order IDs", "Removing function calling and using RAG to look up all possible order IDs", "Adding a guardrail model that screens all LLM output before function execution"],
    correct: 0,
    explanation: "Input validation at the function boundary is the correct defensive pattern — validate format, check existence, and return a clear error that the LLM can relay to the user ('I couldn't find that order number — could you double-check it?'). Fine-tuning cannot eliminate hallucination. A guardrail model adds latency without guaranteed prevention."
  },
  {
    id: 56, domain: 3, difficulty: 2,
    question: "You are building a voice agent that must handle both simple FAQ queries and complex multi-step workflows (e.g., filing an insurance claim). The best architectural pattern is:",
    options: ["A single monolithic LLM prompt that handles all scenarios", "A rule-based decision tree for workflows with LLM only for FAQs", "Two completely separate voice agents with different phone numbers", "A router that classifies intent and dispatches to specialized sub-agents — a lightweight FAQ agent and a stateful workflow agent with step tracking"],
    correct: 3,
    explanation: "A router + specialized agents pattern lets each sub-agent be optimized for its task. The FAQ agent can be lightweight and fast; the workflow agent maintains structured state across steps. A monolithic prompt becomes unwieldy and unreliable. Separate phone numbers create a terrible user experience."
  },
  {
    id: 57, domain: 3, difficulty: 2,
    question: "A voice agent's LLM generates responses averaging 120 tokens, but users complain the agent 'talks too much.' The issue is most likely:",
    options: ["The TTS speaking rate is too slow, making responses feel longer than they are", "The LLM temperature is set too high, causing verbose outputs", "120 tokens is roughly 90 words, which at natural speaking pace takes ~35 seconds — far too long for a spoken response in a conversational turn", "Users are impatient and would complain regardless of length"],
    correct: 2,
    explanation: "120 tokens is approximately 90 words. At 150-170 WPM, that takes about 30-35 seconds to speak — an eternity in conversation where turns should be 5-15 seconds. Voice responses must be drastically shorter than text responses. The system prompt should constrain responses to 30-50 tokens (20-35 words) for conversational turns."
  },
  {
    id: 58, domain: 3, difficulty: 2,
    question: "Your voice agent needs to collect 5 pieces of information (name, date of birth, address, phone, email) from callers. The conversation frequently fails midway. The most effective conversation design improvement is:",
    options: ["Asking for all 5 items in a single prompt to minimize turns", "Implementing slot-filling with explicit tracking of which fields are collected, allowing users to provide information in any order and confirming each item individually", "Using a rigid sequential flow that asks one question at a time in a fixed order", "Pre-filling as many fields as possible from caller ID and skipping the collection entirely"],
    correct: 1,
    explanation: "Flexible slot-filling lets users provide information naturally ('I'm John Smith, born March 5th 1990') while the system tracks what's been captured and only asks for missing items. Rigid sequential flows feel robotic and restart on errors. Asking for all 5 at once overwhelms users in voice. Pre-filling from caller ID is good practice but doesn't eliminate the need for collection."
  },

  // DOMAIN 4 — Voice UX & Conversation Design (59–64)
  {
    id: 59, domain: 4, difficulty: 2,
    question: "Your voice agent's average response latency is 800ms, and user satisfaction scores are low. You can invest engineering effort in reducing latency to 400ms OR in adding conversational filler phrases ('Let me check that for you...'). Which is more impactful?",
    options: ["Reducing latency to 400ms, because users always prefer faster responses", "Both equally — do whichever is cheaper", "Adding filler phrases, because perceived latency matters more than actual latency in voice interactions", "Neither — 800ms is already within acceptable limits for voice"],
    correct: 2,
    explanation: "Research on conversational AI shows that perceived latency matters more than actual latency. An 800ms silence feels like a system failure, but 'Let me look that up for you' followed by 800ms feels natural — humans pause similarly when thinking. Fillers set expectations, reduce perceived wait time, and are far cheaper to implement than halving actual latency."
  },
  {
    id: 60, domain: 4, difficulty: 2,
    question: "A voice agent for elderly users has high task completion rates in testing with young testers but fails in production with actual elderly users. The most likely root cause is:",
    options: ["The agent's speaking rate, vocabulary complexity, and turn-timing assumptions were calibrated for younger speech patterns, not age-related changes in speech and hearing", "Elderly users have lower cognitive ability and cannot use voice interfaces", "The ASR model was not trained on enough elderly voice data", "Elderly users are unfamiliar with AI and refuse to interact"],
    correct: 0,
    explanation: "Elderly users often speak more slowly, use different vocabulary, need longer processing time, and may have hearing loss affecting their responses. An agent calibrated for young testers' pace and vocabulary will have wrong silence thresholds (cutting off slower speakers), overly complex language, and insufficient repetition. ASR accuracy on elderly speech is also a factor, but the UX design mismatch is the primary issue."
  },
  {
    id: 61, domain: 4, difficulty: 2,
    question: "Users of your voice booking agent frequently say 'um' and 'uh' during date selection, causing the ASR to produce garbage transcripts. The best solution is:",
    options: ["Training a custom ASR model that ignores filler words", "Implementing a disfluency filter that strips filler words from ASR output before passing to the LLM, while keeping the VAD active so the user isn't cut off", "Asking users to speak more clearly", "Switching to DTMF input for date selection"],
    correct: 1,
    explanation: "Disfluency filtering (removing 'um', 'uh', 'like', false starts) is standard preprocessing in production voice pipelines. It cleans ASR output without requiring users to change their natural speech patterns. The VAD must remain active during fillers so the system doesn't interpret a pause with 'um' as end-of-turn."
  },
  {
    id: 62, domain: 4, difficulty: 2,
    question: "Your voice agent handles appointment scheduling. Users sometimes say 'next Tuesday' and sometimes say 'the 15th.' The agent should:",
    options: ["Always ask users to provide dates in a specific format to avoid ambiguity", "Only accept absolute dates and reject relative references", "Accept both relative and absolute date references, resolve them to a specific date, and use explicit confirmation ('That's Tuesday, January 15th — is that correct?')", "Use the current date to resolve relative references silently without confirmation"],
    correct: 2,
    explanation: "Good voice UX accepts natural language input in whatever form users provide it, then resolves ambiguity through explicit confirmation. Forcing a specific format creates friction. Silent resolution without confirmation risks errors — 'next Tuesday' is ambiguous if spoken on a Monday (tomorrow or in 8 days?)."
  },
  {
    id: 63, domain: 4, difficulty: 2,
    question: "A voice agent's earcon (a short chime) plays when it starts listening. Users report they sometimes start speaking before the chime. This causes:",
    options: ["No issue — the system will still capture their speech", "Audio feedback loops between the earcon and the user's speech", "The earcon interferes with the ASR model's frequency analysis", "The beginning of the user's utterance is clipped, leading to ASR errors on the first word or phrase, creating a frustrating experience"],
    correct: 3,
    explanation: "If users speak before the system is actively capturing audio (before the earcon), the beginning of their utterance is lost. This causes ASR to miss the first word or words, leading to incorrect transcripts and failed intents. The fix is either making the listening window start before the earcon, or using a visual indicator that precedes the audio cue."
  },
  {
    id: 64, domain: 4, difficulty: 2,
    question: "Your voice agent needs to read a long list of 8 menu items to a caller. The best conversation design approach is:",
    options: ["Present 3-4 items at a time with a 'would you like to hear more?' prompt, using progressive disclosure", "Read all 8 items at once so the user has the complete picture", "Skip the list entirely and ask the user what they're looking for", "Read all items quickly to minimize hold time"],
    correct: 0,
    explanation: "Humans can hold 3-4 items in working memory when listening. Progressive disclosure chunks the list into digestible groups, letting users choose when they hear their option or request more. Reading all 8 overwhelms; skipping the list assumes the user knows what's available; reading quickly sacrifices comprehension."
  },

  // DOMAIN 5 — Enterprise, Compliance & Verticals (65–70)
  {
    id: 65, domain: 5, difficulty: 2,
    question: "A voice AI system processes credit card payments over the phone. During the card number collection, the system must:",
    options: ["Encrypt the audio stream with a higher encryption level during payment", "Ask the user to enter the card number via DTMF keypad tones instead of speaking it", "Route the call to a separate PCI-compliant server for the payment portion", "Pause all call recording and logging, mask the card number in transcripts, and never store the full PAN — per PCI DSS requirements"],
    correct: 3,
    explanation: "PCI DSS prohibits storing full Primary Account Numbers (PAN) in any form, including audio recordings and text transcripts. The system must pause recording during card capture and redact any card data from logs. DTMF is a common alternative that avoids card numbers appearing in audio at all, but the question asks what MUST happen — and the recording/logging pause is mandatory."
  },
  {
    id: 66, domain: 5, difficulty: 2,
    question: "Your company deploys a voice agent for a US healthcare client and a separate one for a German insurance client. The key architectural difference required by regulation is:",
    options: ["The US system requires HIPAA compliance (BAA, PHI encryption, audit logs), while the German system requires GDPR compliance (consent management, data residency in EU, right to erasure)", "The German system must use a different LLM model than the US system", "Both systems have identical compliance requirements since healthcare data is universally regulated the same way", "The German system requires voice biometric authentication while the US system does not"],
    correct: 0,
    explanation: "HIPAA and GDPR are different regulatory frameworks with different requirements. HIPAA focuses on PHI protection with BAAs, encryption, and audit trails. GDPR focuses on consent, data minimization, EU data residency, and individual rights (erasure, portability). A system serving both markets needs to satisfy both independently."
  },
  {
    id: 67, domain: 5, difficulty: 2,
    question: "An enterprise is evaluating voice AI vendors. The procurement team asks for SOC 2 Type II certification. What does this specifically verify?",
    options: ["That the vendor's software has no security vulnerabilities", "That the vendor's security controls have been audited and proven effective over a sustained period (typically 6-12 months), not just designed properly", "That the vendor complies with GDPR and HIPAA simultaneously", "That the vendor's data centers are physically located in the customer's country"],
    correct: 1,
    explanation: "SOC 2 Type II differs from Type I in that it verifies controls were not just designed (Type I) but actually operated effectively over a period of time. It covers security, availability, processing integrity, confidentiality, and privacy. It does not verify regulatory compliance (GDPR/HIPAA) or guarantee zero vulnerabilities."
  },
  {
    id: 68, domain: 5, difficulty: 2,
    question: "A voice AI call center agent handles calls in California. Before recording any call, the system must:",
    options: ["Only inform the caller that the call may be recorded — one-party consent is sufficient", "No disclosure is required for AI-operated calls since they are not 'wiretapping'", "Obtain explicit consent from all parties on the call, as California is a two-party (all-party) consent state", "Only inform the caller if a human agent joins the call"],
    correct: 2,
    explanation: "California Penal Code Section 632 requires all-party consent for recording confidential communications. Both the AI system and the caller must consent. The AI system's disclosure must happen before any recording begins. This applies regardless of whether the call is handled by AI or a human."
  },
  {
    id: 69, domain: 5, difficulty: 2,
    question: "A contact center deploys voice AI to handle 40% of inbound calls. Six months later, Average Handle Time (AHT) has decreased but CSAT scores have also dropped. The most likely explanation is:",
    options: ["The AI is resolving simple calls quickly (lowering AHT) but mishandling complex calls that should be escalated to human agents, creating frustration", "CSAT and AHT are always inversely correlated — faster resolution always means lower satisfaction", "The human agents are performing worse because they handle fewer calls", "The voice AI's TTS voice is unpleasant"],
    correct: 0,
    explanation: "When AI handles easy calls well (fast AHT, high resolution) but fails to properly detect and escalate complex issues, the aggregate AHT drops while frustrated customers on mishandled calls tank CSAT. The fix is better escalation detection — identifying when the AI should transfer to a human rather than continuing to struggle."
  },
  {
    id: 70, domain: 5, difficulty: 2,
    question: "A voice AI vendor claims their system 'does not store any customer data.' However, their ASR uses a cloud provider's speech-to-text API. What is the compliance concern?",
    options: ["There is no concern if the vendor's own servers don't store data", "Cloud ASR APIs only process data in memory and never retain it", "The concern only applies if the cloud provider is in a different country", "The cloud ASR provider processes audio through their infrastructure, creating a sub-processor relationship that requires its own data processing agreement and may involve data retention by the sub-processor"],
    correct: 3,
    explanation: "Under GDPR and most data protection frameworks, the cloud ASR provider is a sub-processor who receives and processes personal data (voice recordings). This requires a Data Processing Agreement (DPA), and the vendor must verify the sub-processor's retention policies. Many cloud ASR providers retain audio for quality improvement unless explicitly opted out."
  },

  // ═══════════════════════════════════════════════════════════════════
  // DIFFICULTY 3 — EXPERT (IDs 71–100)
  // ═══════════════════════════════════════════════════════════════════

  // DOMAIN 1 — Voice AI Fundamentals (71–76)
  {
    id: 71, domain: 1, difficulty: 3,
    question: "You are deploying a voice agent that must serve users speaking African American Vernacular English (AAVE), Appalachian English, and Standard American English. Your ASR benchmark shows 5% WER on Standard American but 18% on AAVE. The root cause is most likely:",
    options: ["AAVE speakers talk faster, causing the ASR to miss words", "The ASR training data is disproportionately Standard American English, creating systematic bias against dialectal variation in phonology, grammar, and vocabulary", "AAVE has a smaller vocabulary that confuses the language model", "The acoustic model architecture is fundamentally incompatible with tonal variation in AAVE"],
    correct: 1,
    explanation: "ASR bias against non-standard dialects is a well-documented problem caused by training data imbalance. AAVE has distinct phonological rules (e.g., consonant cluster reduction, habitual 'be'), grammatical structures, and vocabulary that are underrepresented in most training corpora. The fix requires inclusive data collection and dialect-aware evaluation, not architectural changes."
  },
  {
    id: 72, domain: 1, difficulty: 3,
    question: "A team is considering replacing their cascaded ASR-LLM-TTS pipeline with a native speech-to-speech model (like GPT-4o audio). What is the most significant production risk of this migration?",
    options: ["Loss of intermediate text representations eliminates the ability to log transcripts, apply text-based guardrails, audit responses, and debug failures at each pipeline stage", "Speech-to-speech models always have higher latency than cascaded pipelines", "Speech-to-speech models cannot handle multiple languages", "The audio quality of speech-to-speech models is always lower than dedicated TTS systems"],
    correct: 0,
    explanation: "The cascaded pipeline's text intermediate is an audit trail — you can log exactly what was heard (ASR), what was decided (LLM), and what was said (TTS). Text-based guardrails, compliance logging, and stage-by-stage debugging all depend on it. Speech-to-speech models trade this observability for lower latency and better prosody preservation, which is a serious production trade-off."
  },
  {
    id: 73, domain: 1, difficulty: 3,
    question: "Your ASR model uses an RNN-T (Recurrent Neural Network Transducer) architecture. During a production incident, you notice the model occasionally 'loops' — repeating the same word or phrase indefinitely in the transcript. The most likely cause is:",
    options: ["A bug in the audio preprocessing that duplicates audio frames", "The prediction network entering a self-reinforcing state where its own output history biases it toward repeating the same token, a known failure mode of autoregressive decoders", "Network packet duplication causing the same audio segment to be processed twice", "The language model component has a corrupted vocabulary entry"],
    correct: 1,
    explanation: "RNN-T's prediction network conditions on its own output history. Under certain input conditions, the decoder can enter a state where emitting a token increases the probability of emitting it again, creating a repetition loop. This is a known failure mode of autoregressive sequence models and is mitigated by repetition penalties, beam search diversity, or output post-processing."
  },
  {
    id: 74, domain: 1, difficulty: 3,
    question: "You need to build a voice agent for a tonal language (Mandarin Chinese) where the same phoneme sequence with different pitch patterns has completely different meanings. Which ASR consideration is MOST critical?",
    options: ["Using a higher audio sample rate to capture pitch variation", "Using a character-level language model instead of word-level", "Ensuring the acoustic model explicitly models F0 (fundamental frequency) contours as features, since tone is carried by pitch patterns that are phonemically distinctive in tonal languages", "Training on more data to compensate for tonal complexity"],
    correct: 2,
    explanation: "In tonal languages, pitch contour (F0) is phonemic — changing the tone changes the word meaning entirely (e.g., Mandarin 'ma' with four tones means 'mother', 'hemp', 'horse', 'scold'). ASR models must explicitly represent F0 features or use architectures that capture pitch patterns. Standard mel spectrogram features partially encode this, but explicit F0 modeling improves tonal language accuracy significantly."
  },
  {
    id: 75, domain: 1, difficulty: 3,
    question: "A voice AI company wants to offer 'instant voice cloning' with only 5 seconds of reference audio. From a technical standpoint, the primary quality trade-off compared to fine-tuning on 30 minutes of reference audio is:",
    options: ["The cloned voice will match the target's general timbre but lack accurate reproduction of the speaker's unique prosodic patterns, speaking habits, and articulatory nuances that require more data to model", "5-second cloning cannot match the target voice at all — it will sound like a completely different person", "There is no quality difference — modern zero-shot cloning matches fine-tuned quality", "5-second cloning produces higher quality because it avoids overfitting to the reference speaker"],
    correct: 0,
    explanation: "Zero-shot voice cloning (few seconds of reference) extracts a speaker embedding that captures general voice characteristics (pitch range, timbre, resonance). However, it cannot learn the speaker's unique prosodic habits, characteristic pauses, emphasis patterns, or articulatory details that emerge from longer exposure. Fine-tuning on more data captures these nuances but requires more time and compute."
  },
  {
    id: 76, domain: 1, difficulty: 3,
    question: "Your team is evaluating ASR models for a legal transcription service. Model A has 4% WER but 12% Named Entity Error Rate (NEER). Model B has 6% WER but 3% NEER. For this use case, which model is better and why?",
    options: ["Model A, because overall WER is the gold standard metric for ASR quality", "Neither — both models need fine-tuning before they can be compared", "Model B, because in legal transcription, correctly capturing names, dates, case numbers, and proper nouns (named entities) is more critical than overall word accuracy — a wrong name is worse than a wrong filler word", "Model A, because lower WER always correlates with better downstream task performance"],
    correct: 2,
    explanation: "In legal transcription, misrecognizing a person's name, case number, statute reference, or date can have serious consequences, while misrecognizing a filler word or common word is less impactful. Model B's 3% NEER means it gets the critical entities right far more often. WER alone doesn't capture what matters for domain-specific applications — task-specific metrics like NEER are often more meaningful."
  },

  // DOMAIN 2 — Real-Time Architecture & Pipelines (77–82)
  {
    id: 77, domain: 2, difficulty: 3,
    question: "You are architecting a global voice agent serving users in North America, Europe, and Asia. End-to-end latency must stay under 500ms everywhere. The most critical architectural decision is:",
    options: ["Using the fastest available LLM model globally", "Using a CDN for audio delivery to reduce latency", "Running everything in a single US data center with a high-bandwidth connection", "Deploying regional inference clusters for ASR and TTS in each geography, with LLM inference either regional or connected via low-latency backbone, because cross-ocean network hops add 100-200ms each way"],
    correct: 3,
    explanation: "Cross-ocean network latency is physics-constrained: US-Europe is ~80-120ms round trip, US-Asia is ~150-250ms. A cascaded pipeline with three stages (ASR, LLM, TTS) crossing oceans means multiplied latency. Regional deployment of at least ASR and TTS keeps audio processing local. LLM can be centralized if connected via dedicated backbone, but the audio-processing stages must be geographically distributed."
  },
  {
    id: 78, domain: 2, difficulty: 3,
    question: "Your voice agent experiences a 'latency cliff' — it performs well under 2,000 concurrent sessions but latency spikes dramatically at 2,500+. The TTS service runs on GPU instances. The most likely cause is:",
    options: ["The WebRTC server running out of CPU for signaling", "GPU memory exhaustion causing TTS inference to fall back to CPU or queue behind other requests, since GPU batching has a hard capacity limit that creates non-linear latency degradation", "Network bandwidth saturation between services", "The LLM provider rate-limiting requests at that volume"],
    correct: 1,
    explanation: "GPU inference has hard capacity limits determined by GPU memory and compute throughput. Below capacity, batching keeps latency low. At capacity, requests queue and latency increases linearly. Slightly above capacity, queuing cascades cause latency spikes — a non-linear 'cliff.' The fix is auto-scaling GPU instances based on queue depth, not just request count."
  },
  {
    id: 79, domain: 2, difficulty: 3,
    question: "A voice agent uses a cascaded pipeline where ASR streams partial transcripts to the LLM. The team wants to start LLM inference before the user finishes speaking to reduce latency. The primary technical challenge is:",
    options: ["ASR partial transcripts change as more audio arrives (hypothesis revision), so early LLM inference may be based on incorrect input that gets revised, requiring speculative execution with rollback capability", "The LLM cannot accept input while it is generating output", "Streaming ASR does not produce any output until the utterance is complete", "The TTS system cannot handle variable-length inputs from speculative LLM output"],
    correct: 0,
    explanation: "Streaming ASR produces interim results that frequently change as more context arrives (e.g., 'I'd like to book a fl...' becomes 'I'd like to book a flight'). Starting LLM inference on interim transcripts risks wasted computation when the transcript is revised. This requires speculative execution — beginning inference optimistically and discarding/restarting when the ASR hypothesis changes significantly."
  },
  {
    id: 80, domain: 2, difficulty: 3,
    question: "You need to handle voice agent failover when a TTS provider experiences an outage mid-conversation. The user is currently hearing a response. The best failover strategy is:",
    options: ["Immediately switch to the backup TTS provider and continue the response", "Pause the conversation and wait for the primary TTS to recover", "Complete the current utterance from the TTS cache/buffer, then switch to the backup TTS provider for the next response, accepting a potential voice change", "Pre-render all possible responses with both TTS providers and serve from cache"],
    correct: 2,
    explanation: "Mid-utterance TTS switching would cause jarring audio discontinuity. The correct approach is to drain the current audio buffer (finishing the current sentence), then failover to the backup provider for the next turn. This means a voice change between turns — noticeable but far less disruptive than mid-sentence switching or conversation pausing."
  },
  {
    id: 81, domain: 2, difficulty: 3,
    question: "Your voice pipeline processes audio at 16kHz/16-bit mono PCM internally. Each second of audio is 32KB. At 5,000 concurrent sessions with 3-second average utterances, what is the approximate memory pressure on your ASR service's audio buffer?",
    options: ["~480MB — manageable with standard server memory", "~32MB — trivial memory usage", "~4.8GB — significant but within modern server capacity", "~48GB — requires specialized high-memory instances"],
    correct: 0,
    explanation: "32KB/sec x 3 seconds = 96KB per session buffer. At 5,000 concurrent sessions: 96KB x 5,000 = 480,000KB = ~480MB. This is well within standard server memory. The calculation matters because voice pipelines often have multiple buffer stages (input, processing, output), and understanding per-session memory footprint is essential for capacity planning."
  },
  {
    id: 82, domain: 2, difficulty: 3,
    question: "A team deploys a voice agent using SIP trunking to handle PSTN calls. During load testing, they discover that while WebRTC sessions handle barge-in smoothly, PSTN calls have a 300ms delay before the agent recognizes a barge-in. The cause is:",
    options: ["PSTN calls use half-duplex audio, preventing simultaneous send and receive", "PSTN networks inherently do not support barge-in", "The SIP protocol requires a signaling exchange before switching speaker roles", "The SIP-to-WebRTC media gateway introduces transcoding latency, and PSTN's echo cancellation requires additional buffering that delays the far-end VAD detection"],
    correct: 3,
    explanation: "PSTN calls pass through media gateways for codec transcoding (G.711 to Opus) and require acoustic echo cancellation to prevent the agent's own speech from triggering VAD. Both add latency. The echo canceller needs a buffer to distinguish the user's voice from the reflected agent audio, which delays barge-in detection. WebRTC handles this natively with lower latency."
  },

  // DOMAIN 3 — LLM + Voice Orchestration (83–88)
  {
    id: 83, domain: 3, difficulty: 3,
    question: "A voice agent handles insurance claims. The LLM must extract structured data (claim type, date of incident, policy number, description) from free-form speech. The user says: 'Yeah so my car got hit in the parking lot last Thursday, policy is PX-882341, it was pretty bad.' The best extraction architecture is:",
    options: ["Regular expressions applied to the ASR transcript", "A dedicated NER model followed by a separate classification model", "Prompting the LLM with a structured output schema (JSON) that maps to the required fields, with the transcript as input and explicit instructions to extract or mark fields as missing", "A rule-based slot-filling system with keyword matching"],
    correct: 2,
    explanation: "LLM-based structured extraction with a JSON schema handles the variability of natural speech better than regex or keyword matching. The LLM can resolve 'last Thursday' to a date, classify 'car got hit in the parking lot' as a collision claim, and extract the policy number — all in one inference call. Dedicated NER + classification adds pipeline complexity without clear accuracy gains when using a capable LLM."
  },
  {
    id: 84, domain: 3, difficulty: 3,
    question: "Your voice agent uses function calling and occasionally enters an infinite tool-calling loop — the LLM calls a function, receives the result, then calls the same function again with slightly different parameters. The most robust architectural fix is:",
    options: ["Implementing a server-side tool-call circuit breaker that tracks call frequency per function per conversation turn and halts after a configurable limit, forcing the LLM to generate a user-facing response", "Adding a maximum retry count in the system prompt instructions", "Fine-tuning the LLM to never call the same function twice", "Removing function calling and using RAG instead"],
    correct: 0,
    explanation: "System prompt instructions are suggestions, not guarantees — the LLM may ignore them under edge conditions. A server-side circuit breaker is deterministic: it enforces limits regardless of LLM behavior. When triggered, it returns a structured message telling the LLM to synthesize a response from available data rather than making another call. This is a defense-in-depth pattern."
  },
  {
    id: 85, domain: 3, difficulty: 3,
    question: "You are building a voice agent that must handle sensitive conversations (mental health support line). The agent must detect escalation signals (self-harm references, extreme distress) and immediately transfer to a human counselor. The most reliable implementation is:",
    options: ["Training the LLM to detect these signals via system prompt instructions and generate a transfer action", "A parallel safety classifier running on every ASR transcript that triggers an immediate hard transfer to a human, independent of the LLM's reasoning — because LLM compliance with safety instructions is probabilistic, not deterministic", "Post-processing LLM output to detect if it mentions crisis resources", "Relying on the LLM's built-in safety training to handle crisis situations appropriately"],
    correct: 1,
    explanation: "For life-safety scenarios, relying on LLM prompt compliance is insufficient — LLMs follow instructions probabilistically and can fail. A dedicated safety classifier running in parallel on raw ASR output provides deterministic detection independent of LLM behavior. This defense-in-depth approach ensures escalation happens even if the LLM fails to recognize or act on crisis signals."
  },
  {
    id: 86, domain: 3, difficulty: 3,
    question: "A voice agent serves a product catalog with 50,000 SKUs. RAG retrieval uses embedding similarity. Users frequently ask about products using colloquial names ('the blue widget thing') while the catalog uses formal names ('Azure Precision Component Model 7B'). The retrieval frequently fails. The best fix is:",
    options: ["Increasing the number of retrieved documents (top-k) to improve recall", "Asking users to use exact product names", "Fine-tuning the embedding model on your product catalog", "Building a hybrid retrieval system that combines embedding similarity with keyword search, plus maintaining a synonym mapping table that links colloquial terms to formal product names"],
    correct: 3,
    explanation: "Embedding similarity alone fails when the semantic gap between user language and catalog language is too large. A hybrid approach combines dense retrieval (embeddings) for semantic matching with sparse retrieval (BM25/keyword) for exact term matching, plus an explicit synonym table for known colloquial-to-formal mappings. This covers the full spectrum from exact matches to fuzzy semantic matches."
  },
  {
    id: 87, domain: 3, difficulty: 3,
    question: "Your voice agent needs to handle multi-turn negotiations (e.g., negotiating a service contract renewal). The agent must track its own negotiation position, the customer's stated preferences, and the boundaries it cannot cross (minimum price, maximum discount). The best state management architecture is:",
    options: ["Encoding all negotiation state in the system prompt and updating it every turn", "A structured state object maintained server-side with explicit fields (current_offer, customer_preferences, hard_limits, concessions_made), injected into the LLM context each turn alongside a negotiation strategy prompt", "Letting the LLM maintain state implicitly through conversation history alone", "Using a separate fine-tuned negotiation model that doesn't need explicit state"],
    correct: 1,
    explanation: "Complex stateful workflows like negotiations require explicit, structured state management outside the LLM. A server-side state object ensures critical data (price floors, discount limits, what's been offered) is never lost or hallucinated. The LLM receives this structured context each turn and reasons about what to say, but the authoritative state lives in the application layer."
  },
  {
    id: 88, domain: 3, difficulty: 3,
    question: "A voice agent simultaneously uses function calling (for actions) and RAG (for knowledge). During a single turn, the LLM needs to retrieve product specs AND check inventory AND generate a response. The optimal orchestration pattern is:",
    options: ["Sequential execution: RAG retrieval, then function call, then LLM generation — each step waits for the previous", "Let the LLM decide the order by issuing one tool call at a time in a loop", "Parallel fan-out: issue RAG retrieval and function calls simultaneously based on the user's intent, collect all results, then make a single LLM generation call with all context assembled", "Pre-fetch all possible data before the user speaks to eliminate retrieval latency"],
    correct: 2,
    explanation: "Parallel fan-out minimizes total latency by executing independent operations (retrieval, API calls) concurrently. Sequential execution adds each step's latency. Single-tool-at-a-time loops multiply latency by the number of calls. The orchestrator identifies needed operations from the user's intent, fans them out in parallel, and assembles the complete context for a single LLM generation pass."
  },

  // DOMAIN 4 — Voice UX & Conversation Design (89–94)
  {
    id: 89, domain: 4, difficulty: 3,
    question: "You are designing a voice agent for a drive-through restaurant. The environment has engine noise, multiple speakers, wind, and intercom distortion. Which combination of design decisions is MOST critical for success?",
    options: ["High-quality TTS and a friendly persona to make the experience pleasant", "A more powerful LLM to handle noisy transcripts intelligently", "Lower ASR confidence thresholds to accept more uncertain transcripts and avoid re-prompting", "Aggressive noise cancellation, a constrained dialogue with limited vocabulary per turn, explicit confirmation of every item, and visual display confirmation on the customer-facing screen"],
    correct: 3,
    explanation: "Hostile acoustic environments require a layered defense: noise cancellation at the signal level, constrained dialogue to limit the ASR vocabulary per turn (improving accuracy), explicit confirmation to catch errors before they propagate, and multimodal confirmation (screen) as a redundant channel. A better LLM cannot compensate for fundamentally degraded ASR input."
  },
  {
    id: 90, domain: 4, difficulty: 3,
    question: "Your voice agent has a 92% task completion rate, but user satisfaction surveys reveal frustration. Conversation logs show the agent successfully completes tasks but in a way that feels 'robotic and tedious.' The most impactful UX improvement is:",
    options: ["Redesigning the conversation flow to be more adaptive — inferring information from context instead of asking every field explicitly, using implicit confirmation for low-risk items, and adding discourse markers and personality to responses", "Switching to a more natural-sounding TTS voice", "Reducing the number of confirmation steps to speed up the interaction", "Adding background music to make the interaction more pleasant"],
    correct: 0,
    explanation: "High task completion but low satisfaction points to conversational quality, not functional capability. Adaptive flows that skip unnecessary questions ('I see you're calling from your registered number — is this about your account ending in 4523?'), appropriate confirmation levels, and natural language patterns transform a functional-but-tedious bot into a competent-and-pleasant agent."
  },
  {
    id: 91, domain: 4, difficulty: 3,
    question: "A voice agent deployed in Japan needs to handle the complex politeness levels (keigo) of Japanese. Users speaking in humble form (kenjougo) to the agent expect responses in polite form (teineigo). The most architecturally sound approach is:",
    options: ["Training a separate Japanese LLM fine-tuned on polite speech", "Using a translation layer that converts casual LLM output to polite Japanese", "Ignoring politeness levels since AI agents are not expected to follow social norms", "Implementing politeness level detection from ASR output and dynamically adjusting the system prompt's language register instructions, combined with a TTS voice trained on formal Japanese speech patterns"],
    correct: 3,
    explanation: "Japanese keigo is not just vocabulary — it is a complete system of grammatical forms, verb conjugations, and speech patterns. The solution requires both LLM-level control (system prompt adjusting register based on detected politeness level) and TTS-level control (a voice model that produces appropriately formal prosody). Post-processing translation would break grammatical coherence."
  },
  {
    id: 92, domain: 4, difficulty: 3,
    question: "During A/B testing of your voice agent, variant A (warm, empathetic tone) outperforms variant B (efficient, professional tone) on CSAT for general inquiries. However, variant B outperforms A for technical support issues. The correct product decision is:",
    options: ["Deploy variant A everywhere since CSAT is higher on average", "Deploy variant B everywhere since technical support is higher value", "Implement context-sensitive persona switching — warm tone for general inquiries, professional tone for technical issues — by detecting the nature of the call and adjusting the system prompt accordingly", "Run the A/B test longer to reach statistical significance"],
    correct: 2,
    explanation: "Users have different expectations in different contexts. Empathy matters when someone is frustrated or confused; efficiency matters when they need technical precision. Context-sensitive persona adaptation serves both needs. A single tone optimized for average performance underserves both segments."
  },
  {
    id: 93, domain: 4, difficulty: 3,
    question: "Your voice agent handles medical appointment scheduling. A patient says: 'I need to see someone soon, I've been having chest pains.' The agent should:",
    options: ["Schedule the next available appointment as requested", "Immediately provide medical advice about chest pain symptoms", "Recognize the potential urgency indicator, break from the normal scheduling flow, and advise the patient to call emergency services or go to an ER while offering to keep the scheduling context for a follow-up", "Transfer to a human agent who can assess the urgency"],
    correct: 2,
    explanation: "Voice agents in healthcare contexts must have escalation protocols for urgency signals. 'Chest pains' is a potential emergency indicator. The agent should not provide medical advice (scope limitation) or simply continue scheduling (ignoring urgency). The correct behavior is acknowledging the concern, recommending emergency services, and preserving context. This requires explicit urgency detection in the conversation design."
  },
  {
    id: 94, domain: 4, difficulty: 3,
    question: "You are designing the conversation flow for a voice agent that handles apartment leasing inquiries. Callers frequently ask compound questions: 'Do you have any 2-bedrooms available, what's the price range, and do you allow dogs?' The best design pattern is:",
    options: ["Answer only the first question and ignore the rest, asking if they have more questions", "Parse and answer all three questions in a single long response", "Decompose the compound query into individual questions, answer each briefly in sequence with clear verbal markers ('Regarding availability... On pricing... And about pets...'), and offer to go deeper on any one", "Ask the user to repeat each question one at a time"],
    correct: 2,
    explanation: "Compound questions are natural in voice but challenge both understanding and response design. Decomposing and answering in sequence with verbal markers gives structure to the response. Long single responses lose listeners. Ignoring parts or asking for repetition frustrates callers. The marker pattern ('Regarding X... For Y... And about Z...') helps listeners track which question is being addressed."
  },

  // DOMAIN 5 — Enterprise, Compliance & Verticals (95–100)
  {
    id: 95, domain: 5, difficulty: 3,
    question: "A multinational bank wants to deploy a voice agent across the US, UK, and EU. The agent handles account inquiries that involve personal financial data. Which regulatory combination creates the most complex compliance challenge?",
    options: ["The intersection of GDPR (EU data protection), FCA regulations (UK financial services), US state-level privacy laws (CCPA, BIPA), and MiFID II (investment communications) — each with different consent, retention, and recording requirements that may conflict", "GDPR alone, since it is the strictest regulation", "PCI DSS, since all regions share the same payment card standards", "SOC 2 certification covers all regions uniformly"],
    correct: 0,
    explanation: "Cross-jurisdictional deployment creates compliance complexity because regulations differ and sometimes conflict. GDPR's data minimization vs. MiFID II's recording mandate; BIPA's biometric consent vs. UK FCA's identification requirements; CCPA's deletion rights vs. financial record retention obligations. Each jurisdiction needs independent compliance analysis with conflict resolution."
  },
  {
    id: 96, domain: 5, difficulty: 3,
    question: "Your company's voice AI uses customer call recordings to improve ASR accuracy through model retraining. Under GDPR, which requirement is MOST commonly violated by this practice?",
    options: ["The right to data portability — customers should be able to export their recordings", "Purpose limitation — recordings collected for service delivery cannot be repurposed for model training without separate, specific consent for that distinct purpose", "The right to be forgotten — customers can request deletion at any time", "Data minimization — only necessary data should be collected"],
    correct: 1,
    explanation: "GDPR Article 5(1)(b) requires purpose limitation — data collected for one purpose (providing service) cannot be used for another (model training) without a separate lawful basis. Many voice AI companies violate this by using service recordings for training without explicit consent for that secondary purpose. The consent must be specific, informed, and freely given (not bundled with service consent)."
  },
  {
    id: 97, domain: 5, difficulty: 3,
    question: "An insurance company deploys a voice AI claims agent. The agent must assess claim validity during the call. An auditor discovers the LLM sometimes denies claims based on patterns in training data that correlate with the caller's accent or speaking style. This is an example of:",
    options: ["Standard AI hallucination that can be fixed with better prompting", "A feature, not a bug — the system is detecting fraud signals", "A TTS problem that makes the agent sound dismissive to certain callers", "Algorithmic bias in automated decision-making, which under GDPR Article 22 and US anti-discrimination law may constitute prohibited discrimination and requires human review of consequential automated decisions"],
    correct: 3,
    explanation: "Automated decisions that significantly affect individuals (claim denial) based on protected characteristics (proxied through accent/speaking style) violate anti-discrimination laws and GDPR Article 22 (right not to be subject to solely automated decision-making with legal effects). This requires human-in-the-loop review for consequential decisions and bias auditing of the model's decision patterns."
  },
  {
    id: 98, domain: 5, difficulty: 3,
    question: "A hospital deploys a voice AI for post-discharge patient follow-up calls. The system calls patients, asks about their recovery, and records responses. Three months later, a patient requests complete deletion of their data under their state's privacy law. The compliance challenge is:",
    options: ["Medical record retention laws (typically 6-10 years depending on state) may conflict with the deletion request — the hospital must retain medical records for the legally mandated period while potentially deleting non-clinical portions of the voice data", "The hospital can simply refuse since healthcare data is exempt from privacy laws", "The deletion request is straightforward — delete all recordings immediately", "HIPAA overrides all state privacy laws, so no state deletion right applies"],
    correct: 0,
    explanation: "This creates a genuine legal tension. Medical record retention statutes require keeping clinical records for years. But the voice recording contains both clinical information (recovery status) and non-clinical data. The hospital must separate what constitutes a medical record (retain) from what does not (potentially delete), and document the legal basis for retention. HIPAA does not automatically override state privacy rights."
  },
  {
    id: 99, domain: 5, difficulty: 3,
    question: "A voice AI vendor serving enterprise clients is asked to implement voice biometric authentication. The system would verify caller identity by comparing their voice to a stored voiceprint. In Illinois, this triggers which specific legal requirement?",
    options: ["HIPAA compliance, since voice data is health information", "The Illinois Biometric Information Privacy Act (BIPA), which requires written informed consent before collecting biometric identifiers, a published retention and destruction policy, and prohibits selling biometric data — with a private right of action allowing individual lawsuits", "FCC regulations on telephone authentication", "PCI DSS requirements for identity verification"],
    correct: 1,
    explanation: "Illinois BIPA is one of the strictest biometric privacy laws in the US. It specifically covers voiceprints as biometric identifiers, requires written consent before collection, mandates a publicly available retention/destruction schedule, and — critically — provides a private right of action allowing individuals to sue for violations ($1,000-$5,000 per violation). BIPA lawsuits have resulted in multi-million dollar settlements."
  },
  {
    id: 100, domain: 5, difficulty: 3,
    question: "A contact center processes 100,000 calls/day across 12 countries. They want to implement real-time voice AI analytics (sentiment, intent, compliance monitoring) on all calls. The most architecturally sound approach to data residency compliance is:",
    options: ["Process all calls in one central location and anonymize the output before sending results to each country", "Route all calls through the EU since GDPR is the strictest standard", "Store recordings in the country of the caller's phone number origin", "Deploy regional processing clusters that keep raw audio within each jurisdiction's boundaries, with only aggregated and anonymized analytics flowing to the central dashboard — ensuring no raw voice data crosses borders"],
    correct: 3,
    explanation: "Data residency laws require processing and storage within specific jurisdictions. Regional processing clusters ensure raw voice data (personal data) stays within borders. Anonymized analytics can flow centrally because they are no longer personal data. Central processing violates residency requirements. Routing everything through the EU does not satisfy non-EU data residency laws. Phone number origin does not necessarily match the caller's jurisdiction."
  },
];

const BADGES = {
  0: { pass: { title: "Voice AI Curious", tag: "Beginner" }, ace: { title: "Voice AI Initiate", tag: "Beginner — Distinction" } },
  1: { pass: { title: "Voice AI Explorer", tag: "Foundations" }, ace: { title: "Voice AI Scholar", tag: "Foundations — Distinction" } },
  2: { pass: { title: "Voice AI Practitioner", tag: "Intermediate" }, ace: { title: "Voice AI Engineer", tag: "Intermediate — Distinction" } },
  3: { pass: { title: "Voice AI Architect", tag: "Expert" }, ace: { title: "Voice AI Visionary", tag: "Expert — Distinction" } },
};

const getBadge = (difficulty, score) => {
  const tier = BADGES[difficulty] ?? BADGES[1];
  return score >= 900 ? tier.ace : tier.pass;
};

const gridBg = {
  backgroundImage: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
  backgroundSize: "24px 24px",
};

const PASS_THRESHOLD = 0.69;

export default function VoiceAIExam() {
  const [screen, setScreen] = useState("intro"); // intro | config | exam | results | certificate | glossary
  const [candidateName, setCandidateName] = useState("");
  const [glossarySearch, setGlossarySearch] = useState("");
  const [glossaryFilter, setGlossaryFilter] = useState("all"); // all | exam | domain-id
  const [expandedTerm, setExpandedTerm] = useState(null);
  const [glossaryFrom, setGlossaryFrom] = useState("intro");
  const [difficulty, setDifficulty] = useState(0); // 0=Beginner, 1=Foundations, 2=Intermediate, 3=Expert
  const [selectedDomains, setSelectedDomains] = useState([1, 2, 3, 4, 5]);
  const [questionCount, setQuestionCount] = useState(20);
  const [immediateFeedback, setImmediateFeedback] = useState(true);
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleDomain = (id) => {
    setSelectedDomains((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((d) => d !== id) : prev) : [...prev, id]
    );
  };

  const startExam = () => {
    const pool = QUESTIONS.filter((q) => selectedDomains.includes(q.domain) && q.difficulty === difficulty);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));
    setExamQuestions(selected);
    setCurrentIdx(0);
    setAnswers({});
    setShowExplanation(false);
    setAnswered(false);
    setScreen("exam");
  };

  const handleAnswer = (optionIdx) => {
    if (answered && immediateFeedback) return;
    const q = examQuestions[currentIdx];
    setAnswers((prev) => ({ ...prev, [q.id]: optionIdx }));
    if (immediateFeedback) {
      setAnswered(true);
      setShowExplanation(true);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 >= examQuestions.length) {
      setScreen("results");
    } else {
      setCurrentIdx((i) => i + 1);
      setShowExplanation(false);
      setAnswered(false);
    }
  };

  const submitExam = () => {
    examQuestions.forEach((q) => {
      if (answers[q.id] === undefined) {
        // skip unanswered
      }
    });
    setScreen("results");
  };

  const results = useMemo(() => {
    if (!examQuestions.length) return null;
    const total = examQuestions.length;
    const correct = examQuestions.filter((q) => answers[q.id] === q.correct).length;
    const score = Math.round(100 + (correct / total) * 900);
    const passed = correct / total >= PASS_THRESHOLD;
    const byDomain = DOMAINS.map((d) => {
      const dqs = examQuestions.filter((q) => q.domain === d.id);
      const dc = dqs.filter((q) => answers[q.id] === q.correct).length;
      return { ...d, asked: dqs.length, correct: dc, pct: dqs.length > 0 ? Math.round((dc / dqs.length) * 100) : null };
    }).filter((d) => d.asked > 0);
    return { total, correct, score, passed, byDomain };
  }, [examQuestions, answers, screen]);

  const q = examQuestions[currentIdx];
  const progress = examQuestions.length ? ((currentIdx + (answered ? 1 : 0)) / examQuestions.length) * 100 : 0;

  // ─── INTRO SCREEN ───
  if (screen === "intro") {
    return (
      <div className="min-h-screen bg-white font-mono" style={gridBg}>
        <div className="max-w-2xl mx-auto p-4">
          {/* Header */}
          <div className="border-2 border-black bg-white p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold tracking-widest text-gray-500">VOICE AI / <em>SPACE</em></span>
              <span className="text-xs border border-black px-2 py-0.5">BETA</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-2">Voice AI Knowledge Test</h1>
            <p className="text-sm text-gray-600 mt-1">Foundations — Practice Exam</p>
          </div>

          {/* Exam overview */}
          <div className="border-2 border-black border-t-0 bg-white p-5 space-y-4">
            <p className="text-sm leading-relaxed">
              A fun, hands-on test covering the five core domains of voice AI. Challenge yourself from fundamentals through enterprise deployment.
            </p>
            <div className="grid grid-cols-2 gap-px bg-black border border-black">
              {[["Questions", "Up to 100"], ["Format", "Multiple choice"], ["Passing score", "720 / 1000"], ["Levels", "3 difficulty tiers"]].map(([k, v]) => (
                <div key={k} className="bg-white p-3">
                  <div className="text-xs text-gray-500">{k}</div>
                  <div className="text-sm font-bold">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Domains */}
          <div className="border-2 border-black border-t-0 bg-white">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xs font-bold tracking-widest">EXAM DOMAINS</h2>
            </div>
            {DOMAINS.map((d, i) => {
              const Icon = d.icon;
              return (
                <div key={d.id} className={`flex items-center justify-between p-4 ${i < DOMAINS.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <div className="flex items-center gap-3">
                    <Icon size={14} />
                    <div>
                      <div className="text-sm font-bold">{d.name}</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-bold">{d.weight}</span>
                </div>
              );
            })}
          </div>

          <div className="border-2 border-black border-t-0 bg-black text-white p-4 flex items-center justify-between">
            <span className="text-xs text-gray-400">Voice AI Space · voiceaispace.com</span>
            <div className="flex gap-2">
              <button
                onClick={() => { setGlossaryFrom("intro"); setScreen("glossary"); }}
                className="border border-white/30 text-white text-sm font-bold px-4 py-2 hover:bg-white/10 flex items-center gap-2"
              >
                <BookOpen size={13} /> GLOSSARY
              </button>
              <button
                onClick={() => setScreen("config")}
                className="bg-white text-black text-sm font-bold px-5 py-2 hover:bg-gray-200 flex items-center gap-2"
              >
                START EXAM <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── CONFIG SCREEN ───
  if (screen === "config") {
    return (
      <div className="min-h-screen bg-white font-mono" style={gridBg}>
        <div className="max-w-2xl mx-auto p-4">
          <div className="border-2 border-black bg-white p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest text-gray-500">VOICE AI / <em>SPACE</em></span>
              <h2 className="text-lg font-bold mt-1">Configure your session</h2>
            </div>
            <button onClick={() => setScreen("intro")} className="text-xs border-2 border-black px-3 py-1.5 hover:bg-gray-100">← BACK</button>
          </div>

          {/* Difficulty */}
          <div className="border-2 border-black border-t-0 bg-white p-4">
            <h3 className="text-xs font-bold tracking-widest mb-3">DIFFICULTY LEVEL</h3>
            <div className="flex gap-0">
              {[
                { level: 0, label: "Beginner" },
                { level: 1, label: "Foundations" },
                { level: 2, label: "Intermediate" },
                { level: 3, label: "Expert" },
              ].map(({ level, label }) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-3 text-xs font-bold border-2 border-black -ml-px first:ml-0 ${difficulty === level ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {difficulty === 0 && "Basic vocabulary & core ideas — for those brand new to voice AI"}
              {difficulty === 1 && "Core concepts & applied knowledge — for those familiar with the basics"}
              {difficulty === 2 && "Applied scenarios & trade-offs — for practitioners"}
              {difficulty === 3 && "Production system design — for experienced engineers"}
            </p>
          </div>

          {/* Question count */}
          <div className="border-2 border-black border-t-0 bg-white p-4">
            <h3 className="text-xs font-bold tracking-widest mb-3">NUMBER OF QUESTIONS</h3>
            <div className="flex gap-0">
              {[10, 20, 30, 40].map((n) => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={`flex-1 py-3 text-sm font-bold border-2 border-black -ml-px first:ml-0 ${questionCount === n ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">{questionCount} questions · ~{questionCount * 1.5} min estimated</p>
          </div>

          {/* Domain selection */}
          {/* Feedback mode */}
          <div className="border-2 border-black border-t-0 bg-white p-4">
            <h3 className="text-xs font-bold tracking-widest mb-3">FEEDBACK MODE</h3>
            <div className="flex gap-0">
              {[["Immediate", true], ["End of exam", false]].map(([label, val]) => (
                <button
                  key={String(val)}
                  onClick={() => setImmediateFeedback(val)}
                  className={`flex-1 py-3 text-sm font-bold border-2 border-black -ml-px first:ml-0 ${immediateFeedback === val ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">{immediateFeedback ? "See correct answer after each question" : "Get all results at the end"}</p>
          </div>

          <div className="border-2 border-black border-t-0 bg-black p-4 flex justify-end">
            <button
              onClick={startExam}
              className="bg-white text-black text-sm font-bold px-6 py-2.5 hover:bg-gray-200 flex items-center gap-2"
            >
              BEGIN SESSION <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── EXAM SCREEN ───
  if (screen === "exam" && q) {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correct;
    const domainInfo = DOMAINS.find((d) => d.id === q.domain);
    const Icon = domainInfo.icon;

    return (
      <div className="min-h-screen bg-white font-mono" style={gridBg}>
        <div className="max-w-2xl mx-auto p-4">
          {/* Top bar */}
          <div className="border-2 border-black bg-white p-3 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-gray-500">VOICE AI / <em>SPACE</em></span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">{currentIdx + 1} / {examQuestions.length}</span>
              {!immediateFeedback && (
                <button onClick={submitExam} className="text-xs border-2 border-black px-3 py-1 hover:bg-gray-100 font-bold">SUBMIT</button>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="border-2 border-black border-t-0 bg-white">
            <div className="h-1.5 bg-gray-100">
              <div className="h-full bg-black transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Domain label */}
          <div className="border-2 border-black border-t-0 bg-white px-4 py-2 flex items-center gap-2">
            <Icon size={12} />
            <span className="text-xs font-bold tracking-widest">{domainInfo.name.toUpperCase()}</span>
            <span className="ml-auto text-xs text-gray-400">DOMAIN {q.domain}</span>
          </div>

          {/* Question */}
          <div className="border-2 border-black border-t-0 bg-white p-5">
            <p className="text-sm leading-relaxed font-medium">{q.question}</p>
          </div>

          {/* Options */}
          <div className="border-2 border-black border-t-0 bg-white">
            {q.options.map((opt, idx) => {
              let cls = "w-full text-left flex items-start gap-3 p-4 border-t border-gray-100 text-sm ";
              if (answered && immediateFeedback) {
                if (idx === q.correct) cls += "bg-black text-white ";
                else if (idx === userAnswer && !isCorrect) cls += "bg-gray-200 text-gray-500 line-through ";
                else cls += "text-gray-400 ";
              } else if (!immediateFeedback && userAnswer === idx) {
                cls += "bg-black text-white ";
              } else {
                cls += "hover:bg-gray-50 ";
              }
              return (
                <button key={idx} onClick={() => handleAnswer(idx)} className={cls}>
                  <span className={`font-bold text-xs w-5 shrink-0 mt-0.5 ${answered && immediateFeedback && idx !== q.correct ? "text-gray-400" : ""}`}>
                    {["A", "B", "C", "D"][idx]}
                  </span>
                  <span>{opt}</span>
                  {answered && immediateFeedback && idx === q.correct && (
                    <CheckCircle size={14} className="ml-auto shrink-0 mt-0.5 text-white" />
                  )}
                  {answered && immediateFeedback && idx === userAnswer && !isCorrect && idx !== q.correct && (
                    <XCircle size={14} className="ml-auto shrink-0 mt-0.5 text-gray-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && immediateFeedback && (
            <div className={`border-2 border-t-0 p-4 ${isCorrect ? "border-black bg-black text-white" : "border-black bg-white"}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect
                  ? <><CheckCircle size={13} className="text-white" /><span className="text-xs font-bold tracking-widest">CORRECT</span></>
                  : <><XCircle size={13} /><span className="text-xs font-bold tracking-widest">INCORRECT</span></>
                }
              </div>
              <p className={`text-xs leading-relaxed ${isCorrect ? "text-gray-400" : "text-gray-600"}`}>{q.explanation}</p>
            </div>
          )}

          {/* Next / Skip */}
          <div className="border-2 border-black border-t-0 bg-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">{Object.keys(answers).length} answered</span>
              <button onClick={() => { setGlossaryFrom("exam"); setScreen("glossary"); }} className="text-xs text-gray-400 hover:text-black flex items-center gap-1 transition-all duration-300">
                <BookOpen size={11} /> Study
              </button>
              <button onClick={() => setScreen("intro")} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-all duration-300">
                ✕ Quit
              </button>
            </div>
            {immediateFeedback ? (
              answered && (
                <button onClick={nextQuestion} className="bg-black text-white text-sm font-bold px-5 py-2 hover:bg-gray-800 flex items-center gap-2">
                  {currentIdx + 1 >= examQuestions.length ? "SEE RESULTS" : "NEXT"} <ChevronRight size={14} />
                </button>
              )
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { if (userAnswer === undefined) { setAnswers(prev => ({...prev, [q.id]: -1})); } nextQuestion(); }}
                  className="text-xs border-2 border-black px-3 py-1.5 hover:bg-gray-100"
                >
                  SKIP
                </button>
                {userAnswer !== undefined && (
                  <button onClick={nextQuestion} className="bg-black text-white text-sm font-bold px-5 py-2 hover:bg-gray-800 flex items-center gap-2">
                    {currentIdx + 1 >= examQuestions.length ? "SEE RESULTS" : "NEXT"} <ChevronRight size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS SCREEN ───
  if (screen === "results" && results) {
    const { total, correct, score, passed, byDomain } = results;
    const badge = passed ? getBadge(difficulty, score) : null;
    const levelLabel = difficulty === 3 ? "Expert" : difficulty === 2 ? "Intermediate" : difficulty === 1 ? "Foundations" : "Beginner";
    const shareText = badge
      ? `I just earned "${badge.title}" on the Voice AI Space Knowledge Test — ${score}/1000 across ${byDomain.length} domains. Test yourself:`
      : null;
    const shareUrl = "https://events.voiceaispace.com";

    const handleCopy = () => {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="min-h-screen bg-white font-mono" style={gridBg}>
        <div className="max-w-2xl mx-auto p-4">
          {/* Header */}
          <div className="border-2 border-black bg-white p-4 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-gray-500">VOICE AI / <em>SPACE</em></span>
            <span className="text-xs">{levelLabel.toUpperCase()} · RESULTS</span>
          </div>

          {/* Score banner */}
          <div className={`border-2 border-t-0 p-6 text-center ${passed ? "border-black bg-black text-white" : "border-black bg-white"}`}>
            {badge ? (
              <>
                <Award size={20} className="mx-auto mb-2 text-white" />
                <div className="text-xs font-bold tracking-widest mb-1">{badge.tag.toUpperCase()}</div>
                <div className="text-2xl font-bold tracking-tight mb-3">{badge.title}</div>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertCircle size={18} />
                <span className="text-xs font-bold tracking-widest">NOT YET — KEEP STUDYING</span>
              </div>
            )}
            <div className="text-5xl font-bold my-3">{score}</div>
            <div className={`text-xs ${passed ? "text-gray-400" : "text-gray-500"}`}>
              {correct} / {total} correct · Threshold: 720{score >= 900 && " · Distinction"}
            </div>
          </div>

          {/* Share buttons */}
          {badge && (
            <div className="border-2 border-black border-t-0 bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <Share2 size={12} />
                <span className="text-xs font-bold tracking-widest">SHARE YOUR ACHIEVEMENT</span>
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText + " " + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-black text-sm font-bold hover:bg-black hover:text-white transition-all duration-300"
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-black text-sm font-bold hover:bg-black hover:text-white transition-all duration-300"
                >
                  <Twitter size={14} /> X / Twitter
                </a>
                <button
                  onClick={handleCopy}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-black text-sm font-bold transition-all duration-300 ${copied ? "bg-black text-white" : "hover:bg-black hover:text-white"}`}
                >
                  <Copy size={14} /> {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {/* Domain breakdown */}
          <div className="border-2 border-black border-t-0 bg-white">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xs font-bold tracking-widest">DOMAIN BREAKDOWN</h2>
            </div>
            {byDomain.map((d, i) => {
              const Icon = d.icon;
              const pct = d.pct;
              const status = pct >= 80 ? "strong" : pct >= 60 ? "ok" : "weak";
              return (
                <div key={d.id} className={`p-4 ${i < byDomain.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon size={12} />
                      <span className="text-xs font-bold">{d.name}</span>
                    </div>
                    <span className={`text-xs font-bold ${status === "strong" ? "text-green-600" : status === "ok" ? "text-yellow-600" : "text-red-500"}`}>
                      {pct}% ({d.correct}/{d.asked})
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100">
                    <div
                      className={`h-full ${status === "strong" ? "bg-green-500" : status === "ok" ? "bg-yellow-400" : "bg-red-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wrong answers review */}
          {!immediateFeedback && (
            <div className="border-2 border-black border-t-0 bg-white">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xs font-bold tracking-widest">REVIEW INCORRECT ANSWERS</h2>
              </div>
              {examQuestions.filter((q) => answers[q.id] !== q.correct).map((q, i, arr) => (
                <div key={q.id} className={`p-4 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <p className="text-xs font-bold text-gray-400 mb-1">Q{examQuestions.indexOf(q) + 1} · {DOMAINS.find(d => d.id === q.domain)?.short}</p>
                  <p className="text-xs font-medium mb-2">{q.question}</p>
                  <div className="flex gap-4 text-xs mb-2">
                    <span className="text-red-500"><XCircle size={10} className="inline mr-1" />Your answer: {answers[q.id] >= 0 ? `${["A","B","C","D"][answers[q.id]]}. ${q.options[answers[q.id]]}` : "Skipped"}</span>
                  </div>
                  <div className="text-xs text-green-600 mb-1"><CheckCircle size={10} className="inline mr-1" />Correct: {["A","B","C","D"][q.correct]}. {q.options[q.correct]}</div>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1 border-l-2 border-gray-300 pl-2">{q.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Certificate CTA */}
          {passed && (
            <div className="border-2 border-black border-t-0 bg-white p-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter your full name"
                  className="flex-1 border-2 border-black px-3 py-2 text-sm font-mono focus:outline-none"
                />
                <button
                  onClick={() => candidateName.trim() && setScreen("certificate")}
                  disabled={!candidateName.trim()}
                  className={`text-sm font-bold px-5 py-2 flex items-center gap-2 ${candidateName.trim() ? "bg-black text-white hover:bg-gray-800" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                >
                  <Award size={13} /> VIEW CERTIFICATE
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="border-2 border-black border-t-0 bg-black p-4 flex gap-2 justify-end">
            {!passed && (
              <button onClick={() => { setGlossaryFrom("results"); setScreen("glossary"); }} className="bg-white text-black text-sm font-bold px-4 py-2 hover:bg-gray-200 flex items-center gap-2">
                <BookOpen size={13} /> STUDY
              </button>
            )}
            <button onClick={() => setScreen("config")} className="bg-white text-black text-sm font-bold px-4 py-2 hover:bg-gray-200 flex items-center gap-2">
              <RotateCcw size={13} /> RETRY
            </button>
            <button onClick={() => setScreen("intro")} className="bg-white text-black text-sm font-bold px-4 py-2 hover:bg-gray-200 flex items-center gap-2">
              HOME <ChevronRight size={13} />
            </button>
          </div>

          <div className="p-3 text-center">
            <p className="text-xs text-gray-400">Voice AI Space · voiceaispace.com</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── GLOSSARY SCREEN ───
  if (screen === "glossary") {
    const filtered = GLOSSARY.filter((g) => {
      const matchesSearch =
        !glossarySearch ||
        g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        (g.full && g.full.toLowerCase().includes(glossarySearch.toLowerCase())) ||
        g.definition.toLowerCase().includes(glossarySearch.toLowerCase());
      const matchesFilter =
        glossaryFilter === "all" ||
        (glossaryFilter === "exam" && g.exam) ||
        (Number(glossaryFilter) && g.domain === Number(glossaryFilter));
      return matchesSearch && matchesFilter;
    });

    // Group by letter
    const grouped = filtered.reduce((acc, g) => {
      const letter = g.term[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(g);
      return acc;
    }, {});
    const letters = Object.keys(grouped).sort();

    return (
      <div className="min-h-screen bg-white font-mono" style={gridBg}>
        <div className="max-w-2xl mx-auto p-4">
          {/* Header */}
          <div className="border-2 border-black bg-white p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest text-gray-500">VOICE AI / <em>SPACE</em></span>
              <h2 className="text-lg font-bold mt-1 flex items-center gap-2"><BookOpen size={16} /> Glossary</h2>
            </div>
            <button onClick={() => { setScreen(glossaryFrom); setGlossarySearch(""); setGlossaryFilter("all"); setExpandedTerm(null); }} className="text-xs border-2 border-black px-3 py-1.5 hover:bg-gray-100">
              {glossaryFrom === "exam" ? "← BACK TO EXAM" : "← BACK"}
            </button>
          </div>

          {/* Search */}
          <div className="border-2 border-black border-t-0 bg-white p-4">
            <div className="flex items-center gap-2 border-2 border-black px-3 py-2">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                placeholder="Search terms, acronyms, or keywords..."
                className="flex-1 text-sm focus:outline-none bg-transparent"
              />
              {glossarySearch && (
                <button onClick={() => setGlossarySearch("")} className="text-xs text-gray-400 hover:text-black">✕</button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="border-2 border-black border-t-0 bg-white p-3 flex flex-wrap gap-1.5">
            {[
              { key: "all", label: "All terms" },
              { key: "exam", label: "Exam prep" },
              ...DOMAINS.map((d) => ({ key: String(d.id), label: d.short, Icon: d.icon })),
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setGlossaryFilter(key)}
                className={`text-xs px-3 py-1.5 flex items-center gap-1.5 transition-all duration-300 ${
                  glossaryFilter === key
                    ? key === "exam"
                      ? "bg-black text-white font-bold"
                      : "bg-black text-white font-bold"
                    : "border border-gray-200 hover:border-black"
                }`}
              >
                {Icon && <Icon size={10} />}
                {key === "exam" && <Award size={10} />}
                {label}
              </button>
            ))}
          </div>

          {/* Count */}
          <div className="border-2 border-black border-t-0 bg-gray-100 px-4 py-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">{filtered.length} term{filtered.length !== 1 ? "s" : ""}</span>
            {glossaryFilter === "exam" && (
              <span className="text-xs text-gray-400">These terms may appear on the exam</span>
            )}
          </div>

          {/* Terms */}
          <div className="border-2 border-black border-t-0 bg-white">
            {letters.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-400">No terms match your search.</p>
              </div>
            ) : (
              letters.map((letter) => (
                <div key={letter}>
                  {/* Letter header */}
                  <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 sticky top-0">
                    <span className="text-xs font-bold tracking-widest">{letter}</span>
                  </div>
                  {grouped[letter].map((g, i) => {
                    const isExpanded = expandedTerm === g.term;
                    const DomainIcon = g.domain ? DOMAINS.find((d) => d.id === g.domain)?.icon : null;
                    const domainName = g.domain ? DOMAINS.find((d) => d.id === g.domain)?.short : null;
                    return (
                      <div key={g.term} className={`border-b border-gray-100 ${isExpanded ? "bg-gray-50" : ""}`}>
                        <button
                          onClick={() => setExpandedTerm(isExpanded ? null : g.term)}
                          className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-all duration-300"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold">{g.term}</span>
                              {g.full && <span className="text-xs text-gray-400">({g.full})</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {g.exam && (
                              <span className="text-xs bg-black text-white px-1.5 py-0.5 font-bold">EXAM</span>
                            )}
                            {DomainIcon && <DomainIcon size={11} className="text-gray-400" />}
                            <ChevronDown size={12} className={`text-gray-400 transition-all duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4">
                            <p className="text-xs leading-relaxed text-gray-600">{g.definition}</p>
                            {domainName && (
                              <div className="mt-2 flex items-center gap-1.5">
                                <DomainIcon size={10} className="text-gray-400" />
                                <span className="text-xs text-gray-400">{domainName}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-2 border-black border-t-0 bg-black text-white p-4 flex items-center justify-between">
            <span className="text-xs text-gray-400">Voice AI Space · voiceaispace.com</span>
            {glossaryFrom === "exam" ? (
              <button
                onClick={() => { setScreen("exam"); setGlossarySearch(""); setGlossaryFilter("all"); setExpandedTerm(null); }}
                className="bg-white text-black text-sm font-bold px-5 py-2 hover:bg-gray-200 flex items-center gap-2"
              >
                ← RESUME EXAM
              </button>
            ) : (
              <button
                onClick={() => { setScreen("config"); setGlossarySearch(""); setGlossaryFilter("all"); setExpandedTerm(null); }}
                className="bg-white text-black text-sm font-bold px-5 py-2 hover:bg-gray-200 flex items-center gap-2"
              >
                START EXAM <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── CERTIFICATE SCREEN ───
  if (screen === "certificate" && results?.passed) {
    const { score, correct, total, byDomain } = results;
    const date = new Date();
    const dateStr = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const certId = `VAS-${date.getFullYear()}-${String(score).padStart(4, "0")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const levelLabel = difficulty === 3 ? "Expert" : difficulty === 2 ? "Intermediate" : difficulty === 1 ? "Foundations" : "Beginner";
    const badge = getBadge(difficulty, score);

    const handlePrint = () => {
      window.print();
    };

    return (
      <div className="min-h-screen bg-gray-100 font-mono flex flex-col items-center justify-start" style={gridBg}>
        {/* Print styles */}
        <style>{`
          @media print {
            body { background: white !important; margin: 0; }
            .no-print { display: none !important; }
            .cert-wrapper { padding: 0 !important; background: white !important; }
            .cert-card { box-shadow: none !important; border: 3px solid black !important; }
            @page { size: landscape; margin: 0.5in; }
          }
        `}</style>

        {/* Action bar */}
        <div className="no-print w-full max-w-5xl p-4 flex justify-between items-center">
          <button
            onClick={() => setScreen("results")}
            className="text-xs font-bold tracking-widest text-gray-500 hover:text-black flex items-center gap-1"
          >
            ← BACK TO RESULTS
          </button>
          <button
            onClick={handlePrint}
            className="bg-black text-white text-sm font-bold px-5 py-2 hover:bg-gray-800 flex items-center gap-2"
          >
            PRINT / SAVE PDF
          </button>
        </div>

        {/* Certificate — landscape */}
        <div className="cert-wrapper w-full max-w-5xl px-4 pb-8">
          <div className="cert-card bg-white border-[3px] border-black relative overflow-hidden" style={{ aspectRatio: "1.414 / 1" }}>
            {/* Decorative corner marks */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-black" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-black" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-black" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-black" />

            <div className="flex flex-col items-center justify-center px-12 py-10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px bg-black w-12" />
                <span className="text-xs font-bold tracking-[0.3em] text-gray-400">VOICE AI / <em>SPACE</em></span>
                <div className="h-px bg-black w-12" />
              </div>

              <Award size={20} className="text-black mb-2" />
              <h1 className="text-2xl font-bold tracking-tight mb-1">{badge.title}</h1>
              <p className="text-xs text-gray-400 tracking-widest mb-5">{badge.tag.toUpperCase()}</p>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-4 w-full max-w-md">
                <div className="h-px bg-gray-200 flex-1" />
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              <p className="text-xs tracking-[0.2em] text-gray-400 mb-2">THIS CERTIFIES THAT</p>
              <p className="text-2xl font-bold tracking-tight mb-2">{candidateName}</p>
              <p className="text-xs text-gray-500 max-w-md text-center leading-relaxed mb-5">
                has earned the <strong>{badge.title}</strong> badge on the Voice AI Space Knowledge Test,
                demonstrating {score >= 900 ? "exceptional" : "solid"} proficiency across the core domains of voice AI.
              </p>

              {/* Score block */}
              <div className="inline-block border-2 border-black mb-5">
                <div className="grid grid-cols-3 divide-x-2 divide-black">
                  <div className="px-5 py-3">
                    <div className="text-xl font-bold">{score}</div>
                    <div className="text-xs text-gray-400 mt-0.5">SCORE</div>
                  </div>
                  <div className="px-5 py-3">
                    <div className="text-xl font-bold">{correct}/{total}</div>
                    <div className="text-xs text-gray-400 mt-0.5">CORRECT</div>
                  </div>
                  <div className="px-5 py-3">
                    <div className="text-xl font-bold">{Math.round((correct / total) * 100)}%</div>
                    <div className="text-xs text-gray-400 mt-0.5">ACCURACY</div>
                  </div>
                </div>
              </div>

              {/* Domain proficiency — inline */}
              <div className="w-full max-w-md mb-5">
                <p className="text-xs font-bold tracking-widest text-gray-400 mb-3 text-center">DOMAIN PROFICIENCY</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {byDomain.map((d) => {
                    const Icon = d.icon;
                    return (
                      <div key={d.id} className="flex items-center gap-2">
                        <Icon size={10} className="shrink-0 text-gray-400" />
                        <span className="text-xs flex-1">{d.short}</span>
                        <div className="w-16 h-1.5 bg-gray-200">
                          <div
                            className={`h-full ${d.pct >= 80 ? "bg-black" : d.pct >= 60 ? "bg-gray-400" : "bg-gray-300"}`}
                            style={{ width: `${d.pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold w-8 text-right">{d.pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-8 text-xs text-gray-400 mt-auto">
                <div className="text-center">
                  <div className="font-bold text-black mb-0.5">Date</div>
                  <div>{dateStr}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-300">voiceaispace.com</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-black mb-0.5">Certificate ID</div>
                  <div>{certId}</div>
                </div>
              </div>
            </div>
          </div>

          <p className="no-print text-center text-xs text-gray-400 mt-4">
            Voice AI Space · voiceaispace.com
          </p>
        </div>
      </div>
    );
  }

  return null;
}
