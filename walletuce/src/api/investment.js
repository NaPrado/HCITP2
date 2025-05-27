import { Api } from "./api.js";

class InvestmentApi {
  static getUrl(slug = "") {
    return `${Api.baseUrl}/investment${slug ? "/" + slug : ""}`;
  }

  // GET /api/investment/daily-rate
  static async getDailyRate(controller) {
    return await Api.get(this.getUrl("daily-rate"), true, controller);
  }

  // POST /api/investment/invest?amount=...
  static async invest(amount, controller) {
    const url = this.getUrl("invest") + `?amount=${encodeURIComponent(amount)}`;
    return await Api.post(url, true, {}, controller);
  }

  // POST /api/investment/divest?amount=...
  static async divest(amount, controller) {
    const url = this.getUrl("divest") + `?amount=${encodeURIComponent(amount)}`;
    return await Api.post(url, true, {}, controller);
  }

  // GET /api/investment/daily-returns?page=...&pageSize=...
  static async getDailyReturns({ page = 1, pageSize = 10 } = {}, controller) {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("pageSize", pageSize);
    const url = this.getUrl("daily-returns") + `?${params.toString()}`;
    return await Api.get(url, true, controller);
  }
}

export { InvestmentApi };
