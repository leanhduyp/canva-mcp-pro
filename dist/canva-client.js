import { CANVA_API_BASE_URL } from "./constants.js";
export class CanvaClient {
    token;
    constructor(options = {}) {
        this.token = options.accessToken || process.env.CANVA_ACCESS_TOKEN || "";
    }
    getHeaders(allowMock = false) {
        if (!this.token) {
            if (allowMock) {
                return {
                    Authorization: `Bearer mock_token`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                };
            }
            throw new Error("CANVA_ACCESS_TOKEN is missing. Please set CANVA_ACCESS_TOKEN environment variable in your MCP configuration to connect to Canva Connect API.");
        }
        return {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    }
    async getDesign(designId, signal) {
        if (!this.token) {
            // Mock design info for offline tests if token is not set
            return {
                id: designId,
                title: "Bao_Cao_Chu_De11.pptx",
                page_count: 16,
                urls: {
                    edit_url: `https://www.canva.com/d/${designId}`,
                    view_url: `https://www.canva.com/design/${designId}/view`,
                },
            };
        }
        const res = await fetch(`${CANVA_API_BASE_URL}/designs/${designId}`, {
            headers: this.getHeaders(),
            signal,
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Canva API error (${res.status}): ${errText}`);
        }
        return await res.json();
    }
    async listDesigns(query, signal) {
        if (!this.token) {
            return {
                items: [
                    {
                        id: "DAHaKPDSZSI",
                        title: "Bao_Cao_Chu_De11.pptx",
                        page_count: 16,
                    },
                ],
            };
        }
        const url = new URL(`${CANVA_API_BASE_URL}/designs`);
        if (query)
            url.searchParams.set("query", query);
        const res = await fetch(url.toString(), {
            headers: this.getHeaders(),
            signal,
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Canva API error (${res.status}): ${errText}`);
        }
        return await res.json();
    }
    async createAssetUploadUrl(signal) {
        const res = await fetch(`${CANVA_API_BASE_URL}/asset-uploads`, {
            method: "POST",
            headers: this.getHeaders(),
            signal,
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Canva API error (${res.status}): ${errText}`);
        }
        return await res.json();
    }
    async uploadAsset(imageUrl, assetName, signal) {
        if (!this.token) {
            return {
                asset_id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                name: assetName,
                url: imageUrl,
                status: "uploaded_mock",
                created_at: new Date().toISOString(),
            };
        }
        const res = await fetch(`${CANVA_API_BASE_URL}/asset-uploads`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify({
                name: assetName,
                url: imageUrl,
            }),
            signal,
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Canva Asset Upload API error (${res.status}): ${errText}`);
        }
        return await res.json();
    }
    async getBrandKits(signal) {
        if (!this.token) {
            return {
                brand_kits: [
                    {
                        id: "brand-kit-iuh",
                        name: "Industrial University of Ho Chi Minh City (IUH)",
                        colors: [
                            { hex: "#153898", name: "IUH Academic Blue" },
                            { hex: "#00B0F0", name: "Cyan Presenter Accent" },
                            { hex: "#F4B400", name: "Gold Achievement" },
                            { hex: "#102452", name: "Deep Ink" },
                        ],
                        fonts: {
                            title: "Bai Jamjuree Bold",
                            body: "Bai Jamjuree",
                        },
                    },
                ],
            };
        }
        const res = await fetch(`${CANVA_API_BASE_URL}/brand-kits`, {
            headers: this.getHeaders(),
            signal,
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Canva Brand Kits API error (${res.status}): ${errText}`);
        }
        return await res.json();
    }
    async getBrandKit(brandKitId, signal) {
        if (!this.token) {
            return {
                brand_kit: {
                    id: brandKitId || "brand-kit-iuh",
                    name: "Industrial University of Ho Chi Minh City (IUH)",
                    colors: [
                        { hex: "#153898", name: "IUH Academic Blue" },
                        { hex: "#00B0F0", name: "Cyan Presenter Accent" },
                        { hex: "#F4B400", name: "Gold Achievement" },
                        { hex: "#102452", name: "Deep Ink" },
                    ],
                    fonts: {
                        title: "Bai Jamjuree Bold",
                        body: "Bai Jamjuree",
                    },
                },
            };
        }
        const res = await fetch(`${CANVA_API_BASE_URL}/brand-kits/${brandKitId}`, {
            headers: this.getHeaders(),
            signal,
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Canva Brand Kit API error (${res.status}): ${errText}`);
        }
        return await res.json();
    }
    async autofillBrandTemplate(templateId, title, dataset, signal) {
        const res = await fetch(`${CANVA_API_BASE_URL}/autofills`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify({
                brand_template_id: templateId,
                title,
                data: dataset,
            }),
            signal,
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Canva API error (${res.status}): ${errText}`);
        }
        return await res.json();
    }
    async exportDesign(designId, format = "pptx", signal) {
        const res = await fetch(`${CANVA_API_BASE_URL}/exports`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify({
                design_id: designId,
                format,
            }),
            signal,
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Canva API error (${res.status}): ${errText}`);
        }
        return await res.json();
    }
    async getDesignComments(designId, signal) {
        if (!this.token) {
            // Mock review comments for offline testing and demos
            return {
                items: [
                    {
                        id: "cmt_review_001",
                        thread_id: "thread_slide_16",
                        author: {
                            name: "Reviewer Hội Đồng",
                            email: "hoidong@iuh.edu.vn",
                        },
                        message: "Slide 16: Cần điều chỉnh cỡ chữ phần nhận định lâm sàng lên tối thiểu 24pt, đổi màu nhấn sang bảng màu iuh-brand và đảm bảo huy hiệu Lê Anh Duy (44pt, Cyan #00B0F0) hiển thị rõ.",
                        slide_reference: 16,
                        created_at: new Date(Date.now() - 3600000).toISOString(),
                        status: "open",
                    },
                    {
                        id: "cmt_review_002",
                        thread_id: "thread_slide_17",
                        author: {
                            name: "PGS. TS. Cố Vấn",
                            email: "advisor.ai@hospital.vn",
                        },
                        message: "Bổ sung số liệu độ nhạy Sensitivity 96.8% và kết luận hành động nhấn mạnh tính minh bạch của Decision Tree.",
                        slide_reference: 17,
                        created_at: new Date(Date.now() - 1800000).toISOString(),
                        status: "open",
                    },
                ],
            };
        }
        const res = await fetch(`${CANVA_API_BASE_URL}/designs/${designId}/comments`, {
            headers: this.getHeaders(),
            signal,
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Canva Comments API error (${res.status}): ${errText}`);
        }
        return await res.json();
    }
    async createDesignComment(designId, message, threadId, signal) {
        if (!this.token) {
            return {
                id: `cmt_auto_${Date.now()}`,
                thread_id: threadId || `thread_${Date.now()}`,
                message,
                author: { name: "Canva MCP Pro Bot" },
                status: "created_mock",
                created_at: new Date().toISOString(),
            };
        }
        const res = await fetch(`${CANVA_API_BASE_URL}/designs/${designId}/comments`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify({
                message,
                thread_id: threadId,
            }),
            signal,
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Canva Create Comment API error (${res.status}): ${errText}`);
        }
        return await res.json();
    }
}
//# sourceMappingURL=canva-client.js.map