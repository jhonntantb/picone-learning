import { Document } from '@langchain/core/documents';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Injectable } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeDatabaseRepository {
  private readonly apiToken = process.env.PINECONE_API_KEY;
  private readonly indexName = process.env.PINECONE_INDEX_NAME;
  private readonly pc: Pinecone;
  private readonly embedding: OpenAIEmbeddings;
  constructor() {
    this.pc = new Pinecone({
      apiKey: this.apiToken,
    });
    this.embedding = new OpenAIEmbeddings({
      modelName: 'text-embedding-3-small',
      dimensions: 1536,
      openAIApiKey: process.env.OPENAI_KEY,
    });
  }

  async upsertVectors(data: any) {
    const index = this.pc.Index(this.indexName);

    const docs = new Document({
      metadata: { asset: data.assetId },
      pageContent: data.insight,
    });

    await PineconeStore.fromDocuments([docs], this.embedding, {
      pineconeIndex: index,
      maxConcurrency: 5,
      namespace: 'pulse',
    });
  }
  async searchVector(data: any) {
    const pineconeIndex = this.pc.Index(this.indexName);

    const vectorStore = await PineconeStore.fromExistingIndex(this.embedding, {
      pineconeIndex,
      namespace: 'pulse',
    });
    const results = await vectorStore.similaritySearch(data.insight, 1, {
      asset: data.assetId,
    });

    return results;
  }
}
