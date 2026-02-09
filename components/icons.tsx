import React from 'react';
import { 
  MessageCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  ArrowRight, 
  ArrowLeft, 
  ArrowUp,
  Smile,
  X, 
  Minus,
  Send,
  MoreHorizontal,
  Mail,
  Volume2, 
  Square 
} from 'lucide-react';

const Home = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    {...props}
  >
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

export const Icons = {
  MessageCircle,
  Home,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  Smile,
  X,
  Minus,
  Send,
  MoreHorizontal,
  Mail,
  Volume2,
  Square
};