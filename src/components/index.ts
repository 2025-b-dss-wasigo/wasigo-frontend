/**
 * Archivo barril principal para todos los componentes
 * Organiza las exportaciones por categorías
 */

// ========== COMPONENTES DE AUTENTICACIÓN ==========
export { default as LoginForm } from './auth/LoginForm';
export { default as RegisterForm } from './auth/RegisterForm';

// ========== COMPONENTES COMUNES ==========
export * from './common/BanUserModal';
export * from './common/ClientOnly';
export * from './common/CreateUserModal';
export * from './common/FullScreenLoader';
export * from './common/LoadingSpinner';
export * from './common/RatingModal';
export * from './common/ReportUsersModal';
export * from './common/RouteCard';
export * from './common/StatCard';
export * from './common/StatusBadge';
export * from './common/WithdrawModal';

// ========== COMPONENTES DE LAYOUT ==========
export * from './layout/Sidebar';
export * from './layout/TopBar';
export { LayoutClient } from './layout/LayoutClient';

// ========== COMPONENTES UI (Radix/Shadcn) ==========
export { Badge, badgeVariants } from './ui/badge';
export { Button, buttonVariants } from './ui/button';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from './ui/card';
export { Checkbox } from './ui/checkbox';
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from './ui/dialog';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup
} from './ui/dropdown-menu';
export { Input } from './ui/input';
export { Label } from './ui/label';
export { RadioGroup, RadioGroupItem } from './ui/radio-group';
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton
} from './ui/select';
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
} from './ui/table';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
export { Textarea } from './ui/textarea';

// ========== TIPOS ==========
export type { InputProps } from './ui/input';
