import {
  FileText,
  Folder,
  Terminal as TerminalIcon,
  Globe,
  Settings,
  Leaf,
  Mic,
  Smartphone,
  TrendingUp,
  Gamepad2,
  Bot,
  Heart,
  Code,
} from 'lucide-react';

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  notepad: FileText,
  folder: Folder,
  terminal: TerminalIcon,
  browser: Globe,
  settings: Settings,
  plant: Leaf,
  web: Code,
  health: Heart,
  microphone: Mic,
  phone: Smartphone,
  chart: TrendingUp,
  game: Gamepad2,
  bot: Bot,
};

interface AppIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export function AppIcon({ icon, size = 18, className = '' }: AppIconProps) {
  const Icon = iconMap[icon] || FileText;
  return <Icon size={size} className={className} />;
}
