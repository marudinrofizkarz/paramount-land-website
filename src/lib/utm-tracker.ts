"use client";

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string; // Google Click ID for Google Ads
}

export class UTMTracker {
  private static instance: UTMTracker;
  private utmParams: UTMParams = {};

  private constructor() {
    if (typeof window !== "undefined") {
      this.extractUTMParams();
    }
  }

  public static getInstance(): UTMTracker {
    if (!UTMTracker.instance) {
      UTMTracker.instance = new UTMTracker();
    }
    return UTMTracker.instance;
  }

  private extractUTMParams(): void {
    const urlParams = new URLSearchParams(window.location.search);

    this.utmParams = {
      utm_source: urlParams.get("utm_source") || undefined,
      utm_medium: urlParams.get("utm_medium") || undefined,
      utm_campaign: urlParams.get("utm_campaign") || undefined,
      utm_term: urlParams.get("utm_term") || undefined,
      utm_content: urlParams.get("utm_content") || undefined,
      gclid: urlParams.get("gclid") || undefined,
    };

    // Store in sessionStorage for persistence
    if (
      Object.keys(this.utmParams).some(
        (key) => this.utmParams[key as keyof UTMParams]
      )
    ) {
      sessionStorage.setItem("utmParams", JSON.stringify(this.utmParams));
    } else {
      // Try to get from sessionStorage if not in URL
      const stored = sessionStorage.getItem("utmParams");
      if (stored) {
        this.utmParams = JSON.parse(stored);
      }
    }
  }

  public getUTMParams(): UTMParams {
    return { ...this.utmParams };
  }

  public getSource(): string {
    if (this.utmParams.gclid) return "google_ads";
    if (this.utmParams.utm_source) return this.utmParams.utm_source;
    return "direct";
  }

  public getCampaign(): string {
    return this.utmParams.utm_campaign || "unknown";
  }

  public trackConversionWithUTM(conversionData: any) {
    return {
      ...conversionData,
      ...this.utmParams,
      source: this.getSource(),
      campaign: this.getCampaign(),
    };
  }

  // Enhanced Google Ads conversion tracking
  public trackGoogleAdsConversion(conversionLabel?: string) {
    if (typeof window !== "undefined" && this.utmParams.gclid) {
      // Send conversion to Google Ads (requires gtag)
      if ((window as any).gtag) {
        (window as any).gtag("event", "conversion", {
          send_to: conversionLabel || "AW-CONVERSION_ID/CONVERSION_LABEL",
          value: 1.0,
          currency: "IDR",
          transaction_id: `lead_${Date.now()}`,
        });
      }

      // Send enhanced conversion data to Analytics
      if ((window as any).gtag) {
        (window as any).gtag("event", "generate_lead", {
          currency: "IDR",
          value: 1.0,
          campaign: this.getCampaign(),
          source: this.getSource(),
          medium: this.utmParams.utm_medium || "unknown",
        });
      }
    }
  }
}
