# How LLMs Work — Level 0 to 100
### A complete guide from absolute beginner to research frontier

---

## Level 0 — Absolute Beginner: What is an LLM, really?

LLM stands for **Large Language Model**. Before defining it technically, start with something familiar: how you understand language.

When you read "The cat sat on the ___", your brain instantly suggests "mat" or "floor". Why? Because over years of reading, your brain learned patterns — which words tend to follow which. An LLM does the exact same thing, but using numbers and statistics instead of biological neurons.

### Human Brain vs LLM — Side by Side

| | Human Brain | Large Language Model |
|---|---|---|
| Scale | ~86 billion neurons | Billions of numerical parameters |
| Learning | From experience over years | Trained on trillions of words |
| Understanding | Context, emotion, instinct | Statistical pattern matching |
| Core function | General intelligence | Predicts next likely token |
| Energy | ~20 watts | Thousands of watts |

### The Core Idea

An LLM has **one job**: predict the most likely next word (token). That's it. Everything else — reasoning, coding, writing, translating — emerges from doing this one job at massive scale.

```
Your text input  →  [ LLM — billions of parameters ]  →  Generated text
"Write a poem"       trained on human text               "Roses are red..."
```

### Simple Analogy: Autocomplete on Steroids

Your phone's autocomplete suggests the next word. An LLM is trained on a million times more data, with billions more parameters. Instead of "I am going to the **store**", it can write an entire essay, code a program, or explain quantum physics. Same core idea — vastly more powerful.

### Key Numbers at Level 0

- **1 job** — Predict the next token
- **~1 trillion+** — Words learned from during training
- **Emergent** — Reasoning, coding, and creativity arise naturally from scale

---

## Level 20 — Tokens & Numbers: How Text Becomes Math

Computers don't understand words — they only understand numbers. LLMs convert every piece of text into numerical **tokens** before doing any processing.

### What is a Token?

A token is a chunk of text — sometimes a whole word, sometimes part of a word, sometimes punctuation.

- "I love dogs" → 3 tokens: `["I", " love", " dogs"]`
- "unbelievable" → 3 tokens: `["un", "believ", "able"]`
- Numbers and punctuation also become tokens

On average, 1 token ≈ 0.75 words in English.

### The Pipeline: Text → Embedding → Vector Space

**Step 1 — Tokenise**
Every word is split into tokens and assigned a numerical ID from a vocabulary of ~50,000–100,000 possible tokens.
```
"king"  → ID: 4823
"queen" → ID: 7291
"man"   → ID: 1547
```

**Step 2 — Embed (each token → a list of numbers)**
Each token ID is looked up in an embedding table and converted into a long vector of numbers (768 to 12,288 dimensions in modern models).
```
king  → [0.72, -0.41, 0.89, 0.13, ...]
queen → [0.70, -0.39, 0.85, 0.88, ...]
man   → [0.64, -0.45, 0.12, 0.05, ...]
```

**Step 3 — Vector space**
Similar words cluster near each other in this high-dimensional space. Relationships between words are encoded as directions.

### The Magic of Embeddings

> **king − man + woman ≈ queen**

This works mathematically in embedding space. The direction from "man" to "woman" is the same as the direction from "king" to "queen". The model learns these relationships purely from exposure to text — not from being programmed with rules.

### Geography Analogy for Embeddings

Imagine placing every word on a huge map where similar words are neighbors:
- "Dog" and "puppy" are close together
- "King" and "queen" are close, but in a different region
- "Banana" is far from both
- "Paris" and "France" have a similar relationship to "Berlin" and "Germany"

The LLM learns the layout of this map during training — meaning is captured through position.

---

## Level 40 — The Attention Mechanism: How the Model "Reads"

The key invention that makes modern LLMs powerful is called **self-attention**. It lets the model figure out which words are most relevant to each other — no matter how far apart they are in a sentence.

### What Attention Actually Does

When reading "The bank by the river was steep", how do you know "bank" means riverbank and not a financial bank? You paid attention to "river" nearby.

The attention mechanism gives an LLM exactly this ability. For every word, it asks:
> "Which other words in this sentence should I focus on to understand this one?"

### How Attention Works: Q, K, V

Each token is split into three vectors:

- **Query (Q)** — "What am I looking for?"
- **Key (K)** — "What do I contain / advertise?"
- **Value (V)** — "What information do I actually give?"

The attention score between two tokens = how much the Query of one token matches the Key of another.

```
Attention score = softmax( Q · Kᵀ / √d ) × V
```

High score = "these two tokens are highly relevant to each other" → they share more information.

### Multi-Head Attention

Instead of running attention once, the transformer runs it 8–96 times in **parallel** (called "heads"). Each head learns to focus on different aspects:
- Head 1 might focus on grammatical relationships
- Head 2 might focus on co-reference (who "he" refers to)
- Head 3 might focus on factual associations
- And so on...

All heads' outputs are concatenated and projected back into a single representation.

### Old Approach vs Attention

| | RNNs (old approach) | Attention (transformers) |
|---|---|---|
| Reading style | Words one by one, sequentially | All words simultaneously |
| Context memory | Forgets distant context | Full context always available |
| Parallelism | Cannot parallelise | Highly parallelisable on GPUs |
| Training speed | Slow | Fast at scale |
| Long-range dependencies | Weak | Strong |

### Positional Encoding

Since attention looks at all tokens at once, the model needs to know the order. Positional encodings are added to the embeddings — mathematical patterns that encode "this token is at position 1, this is at position 2..." — so the model can tell "The dog bit the man" from "The man bit the dog."

---

## Level 60 — Training & Learning: How the Model Actually Learns

Training an LLM is like teaching someone by letting them make mistakes on billions of examples and correcting them each time. The correction mechanism is called **backpropagation**.

### The 4 Phases of Building an LLM

**Phase 1 — Pre-training: predict the next token**

Feed the model a sentence like "The sky is ___". It guesses "blue". If correct, great. If wrong (say it guessed "green"), compute how wrong it was using a **loss function**. This happens for trillions of sentences from books, code, Wikipedia, websites, and more.

**Phase 2 — Backpropagation: fix the mistake**

This is the credit assignment problem: which of the billions of parameters were responsible for the wrong guess?

Calculus (the chain rule) traces the error back through all layers and computes a **gradient** — a direction and magnitude for how much each parameter contributed to the mistake. Every parameter gets nudged slightly in the direction that reduces the error.

**Phase 3 — Gradient descent: the optimizer**

Imagine rolling a ball down a hilly landscape to find the lowest valley (minimum loss). Each training step, the ball rolls slightly downhill. After enough steps, you converge to a valley — the model's parameters are optimised.

```
The training loop (repeated trillions of times):
  1. Forward pass  — run data through the model, get prediction
  2. Compute loss  — measure how wrong the prediction was
  3. Backward pass — compute gradients via backpropagation
  4. Update params — nudge every parameter by learning_rate × gradient
```

**Phase 4 — Fine-tuning & RLHF: making it helpful**

A pre-trained model is a raw text predictor. To make it a helpful assistant:

1. **Supervised fine-tuning (SFT)** — train on human-written examples of good Q&A
2. **Reward model training** — humans rate many model responses; train a separate model to predict these ratings
3. **RLHF (Reinforcement Learning from Human Feedback)** — use the reward model as a signal to further train the LLM to produce higher-rated outputs

### Key Training Numbers

| Metric | Value |
|---|---|
| Cost to train frontier models | ~$100M+ |
| Compute for GPT-4 scale | ~10²³ FLOPs |
| Training time | Weeks on 1,000s of GPUs |
| Data used | Trillions of tokens |

### What the Model Actually Learns

The model doesn't explicitly memorise facts. Instead, it learns:
- Grammar and syntax of many languages
- World knowledge encoded in its weights
- Reasoning patterns and analogical thinking
- Stylistic conventions (formal writing, code structure, poetry)
- How to follow instructions

All from the single task of predicting the next token.

---

## Level 80 — Full Architecture: Inside the Transformer

Modern LLMs are based on the **transformer architecture**, introduced in the 2017 paper "Attention Is All You Need" by Vaswani et al. at Google.

### The Full Stack, Layer by Layer

```
Input tokens
      ↓
Token embedding + Positional encoding
      ↓
┌─────────────────────────────────────────┐
│  Transformer Block × N                  │
│  (N = 12 for small, 96+ for frontier)  │
│                                         │
│  1. Layer Normalisation                 │
│  2. Multi-Head Self-Attention           │
│     Q·Kᵀ / √d → softmax → × V          │
│  + Residual connection                  │
│                                         │
│  3. Layer Normalisation                 │
│  4. Feed-Forward Network (FFN)          │
│     Linear → GELU → Linear (4× wider)  │
│  + Residual connection                  │
└─────────────────────────────────────────┘
      ↓
Output projection
      ↓
Probability distribution over all tokens (~50,000)
      ↓
Sample next token (temperature controls randomness)
```

### Breaking Down Each Component

**Token + Positional Embedding**
Converts token IDs into vectors and adds positional encodings so the model knows token order.

**Layer Normalisation**
Stabilises training by normalising the activations at each layer. Applied before each sub-block (pre-norm architecture in modern models).

**Multi-Head Self-Attention**
As described in Level 40 — the heart of the transformer. Each head has its own Q, K, V weight matrices. Outputs from all heads are concatenated and projected.

**Residual Connections**
Each sub-block adds its output back to its input: `output = input + f(input)`. This solves the vanishing gradient problem and allows very deep networks (96+ layers) to train stably.

**Feed-Forward Network (FFN)**
Two linear layers with a non-linear activation (GELU) between them. The hidden layer is 4× wider than the model dimension. This is where most "stored knowledge" appears to live — individual neurons activate for specific concepts.

**Output & Sampling**
The final layer projects to a probability distribution over the entire vocabulary. Sampling strategies:
- **Greedy** — always pick the highest probability token
- **Temperature** — divide logits by T before softmax (T<1 = more focused, T>1 = more creative)
- **Top-k / Top-p (nucleus) sampling** — sample from only the top k tokens or top p probability mass

### Scale of Frontier Models

| Model | Parameters | Layers | Heads | Context |
|---|---|---|---|---|
| GPT-2 (2019) | 1.5B | 48 | 25 | 1,024 |
| GPT-3 (2020) | 175B | 96 | 96 | 2,048 |
| GPT-4 (est.) | ~1T | — | — | 128,000 |
| Claude 3 Opus | — | — | — | 200,000 |

### Factory Analogy for Transformer Layers

Think of each transformer block as a workstation on an assembly line. The token enters raw. At each station:
- First worker (attention) asks "who in this sentence helps me understand this token?" and gathers context from relevant tokens
- Second worker (FFN) applies stored knowledge — facts, grammar rules, reasoning patterns learned during training

After 96 stations, the token is fully understood and the model outputs a prediction.

---

## Level 100 — Research Frontier: Open Problems

Even the most powerful LLMs today have deep, unsolved problems. This is where active research is happening right now (as of 2025).

### 1. Hallucination & Factual Grounding

**The problem:** Models generate fluent, confident-sounding text that is factually wrong. The model predicts plausible token sequences, not verified facts. It has no mechanism to "check" if something is true.

**Active solutions:**
- Retrieval-Augmented Generation (RAG) — give the model access to a search engine or knowledge base at inference time
- Chain-of-thought verification — prompt the model to reason step by step and check each step
- Factual reward signals — train reward models that penalise factual errors
- Uncertainty estimation — make models express when they don't know

---

### 2. Scaling Laws & Emergent Abilities

**The problem:** Chinchilla scaling laws (Hoffmann et al., 2022) showed that compute should be split roughly equally between model size and training data. But surprisingly, certain abilities — multi-step arithmetic, code generation, in-context learning — appear suddenly at scale thresholds. We don't fully understand why.

**The debate:** Do emergent abilities reflect true generalisation, or are they statistical artifacts of how we measure performance? Some researchers argue they disappear when you use smoother metrics.

**Key insight:** The relationship is approximately:
```
Loss ∝ (N / N_c)^(-α_N) + (D / D_c)^(-α_D)
```
Where N = parameters, D = data, with exponents ~0.07 for both.

---

### 3. Long-Context & Memory

**The problem:** Attention scales as O(n²) with context length — quadratically expensive. A 1M token context requires a trillion attention operations per layer.

**Active solutions:**
- **Sparse attention** (Longformer, BigBird) — only attend to a subset of tokens
- **Linear attention** — approximate softmax attention in O(n) time
- **State-space models** (Mamba, SSMs) — recurrent models that scale linearly, competitive with transformers
- **KV cache compression** — compress the key-value cache for long contexts

**Fundamental question:** Can transformers truly reason over very long contexts, or do they only locally aggregate information? Evidence for "lost in the middle" — models struggle with information in the middle of long contexts.

---

### 4. Reasoning & Planning

**The problem:** LLMs can mimic reasoning on seen problem types but often fail at novel multi-step logical problems. They are pattern-matchers, not theorem provers.

**Active solutions:**
- **Chain-of-thought (CoT) prompting** — "think step by step" significantly improves performance
- **Process reward models (PRMs)** — verify each reasoning step, not just the final answer
- **"Thinking" tokens** — models like o1/o3 generate extended internal reasoning before answering
- **Neurosymbolic approaches** — combine LLMs with formal reasoning systems

**The debate:** Is scaling enough to achieve robust reasoning, or do we need architectural changes? Current evidence suggests CoT + scale helps enormously, but hard logical reasoning still has systematic failure modes.

---

### 5. Interpretability — What's Actually Inside?

**The problem:** We train these models but don't understand what they learn. A 70B parameter model is essentially a black box. We can't audit its internal reasoning.

**Active research directions:**

- **Mechanistic interpretability** (Anthropic, DeepMind) — reverse-engineer circuits inside transformers. Findings include induction heads (which implement in-context learning), factual recall circuits, and copy suppression heads.
- **Superposition hypothesis** — models appear to store more features than they have dimensions, using sparse codes (polysemantic neurons that activate for multiple unrelated concepts)
- **Probing classifiers** — train simple classifiers on activations to determine what information is encoded at each layer
- **Activation patching / causal tracing** — surgically edit activations to determine which components are causally responsible for specific outputs

---

### 6. Alignment & Safety

**The problem:** RLHF aligns models with human preferences but can be gamed (reward hacking — models learn to produce outputs that score well with the reward model but aren't genuinely helpful or safe).

**Active approaches:**
- **Constitutional AI** (Anthropic) — train models to follow a set of principles by having them critique and revise their own outputs
- **RLAIF** — use AI feedback instead of (or in addition to) human feedback for scalability
- **Debate** — have two models argue opposite positions; a judge determines the truth
- **Scalable oversight** — human-AI collaboration to supervise tasks that exceed human capability alone

**The deep question:** As models become more capable, how do we ensure their goals remain aligned with human values? This is an open research problem with no consensus solution and potentially civilisation-scale stakes.

---

### 7. Efficiency & Deployment

**Active research areas:**
- **Quantisation** — reduce weight precision from 32-bit to 4-bit with minimal quality loss
- **Distillation** — train small "student" models to mimic large "teacher" models
- **Mixture of Experts (MoE)** — only activate a fraction of parameters per token (e.g. GPT-4 is rumoured to be MoE)
- **Speculative decoding** — use a small model to draft tokens, large model to verify in parallel
- **Flash Attention** — IO-aware attention algorithm that dramatically speeds up training

---

## Where the Field is Going (2025 and Beyond)

| Direction | What it means |
|---|---|
| **Multimodal models** | Text + vision + audio + video + code in one model |
| **Agentic models** | LLMs that take real-world actions, browse the web, write and run code |
| **World models** | Models that understand causality and can simulate physical environments |
| **Continuous learning** | Models that can learn from new information without catastrophic forgetting |
| **Mixture of Experts** | Efficiently scale to trillions of parameters |
| **Synthetic data** | Use AI-generated data to train better AI |

---

## Summary: The Full Picture

```
Text
  ↓ Tokenisation (text → numbers)
Token IDs
  ↓ Embedding (numbers → vectors)
High-dim vectors
  ↓ N × Transformer blocks
  │   ├── Attention: Who should I focus on?
  │   └── FFN: What do I know about this?
Context-aware representations
  ↓ Output projection
Probability distribution
  ↓ Sampling
Next token
  ↓ (repeat until done)
Generated text
```

The entire intelligence of an LLM — its ability to reason, code, write, and converse — emerges from doing this loop, with billions of parameters, trained on trillions of tokens, optimised by gradient descent over weeks of computation.

---

*Guide covers: tokenisation, embeddings, self-attention, transformer architecture, training loop, backpropagation, RLHF, scaling laws, hallucination, interpretability, alignment, and research frontiers.*