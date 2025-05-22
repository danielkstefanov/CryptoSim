import { Holding } from "../lib/holding";
import httpService from "./http-service";

class HoldingsService {
  async getHoldingForSymbol(symbol: string): Promise<number> {
    const result = await httpService.get<Holding>("/holdings", {
      symbol,
    });

    return result?.amount;
  }

  async getHoldings(): Promise<Holding[]> {
    return await httpService.get<Holding[]>("/holdings");
  }
}

export const holdingsService = new HoldingsService();
