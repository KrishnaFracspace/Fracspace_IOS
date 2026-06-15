// utils/rag.ts  (or inline in AIChatScreen.tsx)
// import { cosineSimilarity } from "./utils"; // you'll create this

// ----------------- Hardcoded Fracspace "documents" (later load from files/DB) -----------------
// utils/rag.ts

const fracspaceDocs = [
  {
    id: 1,
    text: "Fracspace is a Hyderabad-based proptech startup founded in 2022 by Unnath Reddy. It allows people to co-own luxury holiday homes fractionally with small investments."
  },
  {
    id: 2,
    text: "Users was bought shares in premium properties located in Munnar, Goa, Kabini, Varanasi, Hyderabad, Bali, and Colombo (Sri Lanka). Main benefits include complimentary stay days, 8-10% rental yields, full property management, and easy exit options."
  },
  {
    id: 3,
    text: "App features: Browse properties, invest in fractions, wishlist, interiors visualization, secure payments. The app was launched on iOS and Android in June 2024. Official website: https://www.fracspace.com"
  },
  {
    id: 4,
    text: "Fractional ownership example: A ₹2 crore Goa villa is divided into 100 equal shares. Each share costs ₹2 lakh. If you buy 5 shares, you get 5% ownership, 5% of rental income, and 5% of the stay days every year."
  },
  {
    id: 5,
    text: "Lakeview by Fracspace Ceylon is a 2.5 BHK apartment in Altair, Colombo, Sri Lanka. Frac Price: ₹26,00,000. It offers beautiful lake view, modern design, and good rental potential."
  },
  {
    id: 6,
    text: "Hilltop by Fracspace is a luxury hilltop property in Munnar, Kerala. Frac Price starts from ₹10,00,000. It is known for stunning tea garden views and peaceful environment."
  },
  {
    id: 7,
    text: "Typical investment: You can start with 1% to 10% share in properties worth ₹1 crore to ₹5 crore. Target annual rental yield is 8-10% plus complimentary personal use days."
  },
  {
    id: 8,
    text: "Benefits of investing in Fracspace: Earn rental income, get free stay days, full management by Fracspace team, legal co-ownership, transparent exits, and secure payments via app."
  },
  {
    id: 9,
    text: "Minimum investment starts from around ₹20,000 to ₹50,000 depending on the property. There is usually a 3-year lock-in period."
  },
  {
    id: 10,
    text: "How to invest: Download the Fracspace app → Browse properties → Choose your favorite → Select number of shares → Complete payment securely."
  },
  {
    id: 11,
    text: "What is the rental yield? Fracspace targets 8-10% annual rental yield. Actual yield depends on occupancy and property performance."
  },
  {
    id: 12,
    text: "Can I visit the property? Yes, investors can book complimentary stay days as per their ownership percentage after purchase."
  },
  {
    id: 13,
    text: "Is it safe? Yes, Fracspace provides legal co-ownership agreement, transparent process, and secure payments. All properties are carefully selected."
  },
  {
    id: 14,
    text: "Best property for beginners: Lakeview in Colombo and Hilltop in Munnar are popular choices for new investors due to good location and rental demand."
  },
  {
    id: 15,
    text: "Present we have two available properties, LAKEVIEW BY FRACSPACE CEYLON and Havelock City, Colombo. remaing Properties was sold"
  },
  {
    id:16,
    text:"Total We have 16 Properties and present latest project is Altaira, location sri lanka  and city colombo"
  }
];

// Cache for embeddings

// Pre-compute embeddings once when app starts (or on first query)
let cachedEmbeddings: { id: number; embedding: number[] }[] = [];

async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch('http://127.0.0.1:11434/api/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'nomic-embed-text',
      prompt: text,
    }),
  });
  const data = await res.json();
  return data.embedding;
}

async function initRAG() {
  if (cachedEmbeddings.length > 0) return;
  console.log('Computing embeddings for Fracspace docs...');
  cachedEmbeddings = await Promise.all(
    fracspaceDocs.map(async (doc) => ({
      id: doc.id,
      embedding: await getEmbedding(doc.text),
    }))
  );
  console.log('Embeddings ready!');
}

// Simple cosine similarity
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// Retrieve top k chunks
 export async function retrieve(query: string, k = 4): Promise<string[]> {
  await initRAG();
  const queryEmb = await getEmbedding(query);
  const results = cachedEmbeddings
    .map((item) => ({
      id: item.id,
      score: cosineSimilarity(queryEmb, item.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  return results.map((r) => fracspaceDocs.find(d => d.id === r.id)!.text);
}