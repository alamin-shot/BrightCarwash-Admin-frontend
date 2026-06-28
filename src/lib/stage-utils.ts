import { APP_CONFIG } from '@/configs/app.config';

export function getStageIconUrl(iconFilename: string | null): string | null {
    if (!iconFilename) return null;
    // Remove /api from the base URL for static file access
    const baseUrl = APP_CONFIG.API_BASE_URL.replace('/api', '');
    return `${baseUrl}/uploads/${iconFilename}`;
}

export function getTextColorForBackground(hexColor: string): string {
    if (!hexColor) return 'text-white';
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 160 ? 'text-[#1B1B1B]' : 'text-white';
}

export function getDefaultStageIcon(stageName: string): string {
    const label = stageName.toLowerCase();
    if (label.includes('new')) return 'new';
    if (label.includes('contract')) return 'contract';
    if (label.includes('convert')) return 'convert';
    if (label.includes('lost')) return 'lost';
    return 'new';
}