import { APP_CONFIG } from '@/configs/app.config';
import type { Stage } from '@/types/stage';
import type { StageOption } from '@/components/ui/StageDropdown';

export function getStageIconUrl(icon: string | null): string | null {
    if (!icon) return null;
    if (icon.startsWith('http://') || icon.startsWith('https://')) {
        return icon;
    }
    const baseUrl = APP_CONFIG.API_BASE_URL.replace('/api', '');
    return `${baseUrl}/uploads/${icon}`;
}

export function getDefaultStageIcon(stageName: string): string {
    const label = stageName.toLowerCase();
    if (label.includes('new')) return 'new';
    if (label.includes('contract')) return 'contract';
    if (label.includes('convert')) return 'convert';
    if (label.includes('lost')) return 'lost';
    return 'new';
}

export function hexToTintedBg(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.12)`;
}

// ✅ Convert Stage[] to StageOption[] (used in LeadsTable and Dashboard)
export function mapStagesToOptions(stages: Stage[]): StageOption[] {
    const nameToValue: Record<string, string> = {
        'new lead': 'new',
        contracted: 'contracted',
        converted: 'converted',
        lost: 'lost',
    };
    return stages.map((s) => ({
        value: nameToValue[s.name.toLowerCase()] ?? s.name.toLowerCase().replace(/\s+/g, '_'),
        label: s.name,
        color: s.color,
        stageId: s.id,
        icon: s.icon,
    }));
}