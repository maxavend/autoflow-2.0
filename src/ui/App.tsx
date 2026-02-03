import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

// Icons from Figma design - exact SVGs
const IconAngled = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.41651 12.9167V7.08333C9.41651 5.24245 10.9089 3.75009 12.7498 3.75H17.0833C17.5436 3.75 17.9167 4.1231 17.9167 4.58333C17.9167 5.04357 17.5436 5.41667 17.0833 5.41667H12.7498C11.8294 5.41675 11.0832 6.16291 11.0832 7.08333V12.9167C11.0832 14.7577 9.59078 16.25 7.74985 16.25H2.91668C2.45644 16.25 2.08334 15.8769 2.08334 15.4167C2.08334 14.9564 2.45644 14.5833 2.91668 14.5833H7.74985C8.67033 14.5833 9.41651 13.8372 9.41651 12.9167Z" fill="currentColor"/></svg>;

const IconCurved = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_2_313)"><path d="M16.6667 15.4167C16.6667 12.6156 15.8677 9.99973 14.5361 8.13558C13.2102 6.27933 11.5531 5.41667 9.99999 5.41667C8.44692 5.41667 6.78984 6.27933 5.46386 8.13558C4.13232 9.99973 3.33332 12.6156 3.33332 15.4167C3.33332 15.8769 2.96023 16.25 2.49999 16.25C2.03975 16.25 1.66666 15.8769 1.66666 15.4167C1.66666 12.3224 2.54453 9.35503 4.10725 7.16715C5.67049 4.97862 7.79048 3.75 9.99999 3.75C12.2095 3.75 14.3295 4.97861 15.8927 7.16715C17.4555 9.35503 18.3333 12.3224 18.3333 15.4167C18.3333 15.8769 17.9602 16.25 17.5 16.25C17.0398 16.25 16.6667 15.8769 16.6667 15.4167Z" fill="currentColor"/></g><defs><clipPath id="clip0_2_313"><rect width="16.6667" height="12.5" fill="white" transform="translate(1.66666 3.75)"/></clipPath></defs></svg>;

const IconStraight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.4279 4.40213C14.7533 4.07673 15.2809 4.07682 15.6063 4.40213C15.9317 4.72756 15.9317 5.25507 15.6063 5.58051L5.58921 15.5976C5.26377 15.923 4.73626 15.923 4.41082 15.5976C4.08551 15.2722 4.08543 14.7446 4.41082 14.4192L14.4279 4.40213Z" fill="currentColor"/></svg>;

// Cap Icons from Figma - Start (Points Left/In) vs End (Points Right/Out)
// LEFT / START Icons
const IconCapNone = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 9.33331C16.3682 9.33331 16.6667 9.63179 16.6667 9.99998C16.6667 10.3682 16.3682 10.6666 16 10.6666H4.66667C4.29848 10.6666 4 10.3682 4 9.99998C4 9.63179 4.29848 9.33331 4.66667 9.33331H16Z" fill="currentColor"/></svg>;

const IconCapArrowLeft = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotate(180deg)'}}><path d="M5.52 8.94086C5.16654 8.94086 4.88 9.2269 4.88 9.57975C4.88 9.9326 5.16654 10.2186 5.52 10.2186V9.57975V8.94086ZM14.9325 10.0315C15.1825 9.78201 15.1825 9.37749 14.9325 9.12799L12.2722 6.47222C12.0222 6.22272 11.617 6.22272 11.3671 6.47222C11.1171 6.72172 11.1171 7.12624 11.3671 7.37575L13.5749 9.57975L11.3671 11.7838C11.1171 12.0332 11.1171 12.4378 11.3671 12.6873C11.617 12.9368 12.0222 12.9368 12.2722 12.6873L14.9325 10.0315ZM5.52 9.57975V10.2186H14.48V9.57975V8.94086H5.52V9.57975Z" fill="currentColor"/></svg>;

const IconCapSolidLeft = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotate(180deg)'}}><path d="M5.66667 9.18234C5.29848 9.18234 5 9.48081 5 9.849C5 10.2182 5.29848 10.5157 5.66667 10.5157V9.849V9.18234ZM13.5 9.849C13.5 11.2197 12.3874 12.3323 11.0167 12.3323C9.64594 12.3323 8.53333 11.2197 8.53333 9.849C8.53333 8.47829 9.64594 7.36568 11.0167 7.36568C12.3874 7.36568 13.5 8.47829 13.5 9.849ZM5.66667 9.849V10.5157H11.0167V9.849V9.18234H5.66667V9.849Z" fill="currentColor"/></svg>;

const IconCapTriangleLeft = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.66667 9.18234C5.29848 9.18234 5 9.48081 5 9.849C5 10.2182 5.29848 10.5157 5.66667 10.5157V9.849V9.18234ZM8.33333 10.5157L13.5692 13.015C14.2329 13.3318 15 12.848 15 12.1126V7.58544C15 6.85003 14.2329 6.36618 13.5692 6.68299L8.33333 9.18234V10.5157ZM5.66667 9.849V10.5157H9V9.849V9.18234H5.66667V9.849Z" fill="currentColor"/></svg>;

const IconCapCircleLeft = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.2 8.92129C4.84654 8.92129 4.56 9.20733 4.56 9.56018C4.56 9.91303 4.84654 10.1991 5.2 10.1991V9.56018V8.92129ZM8.82667 9.56018C8.82667 11.442 10.3549 12.9676 12.24 12.9676C14.1251 12.9676 15.6533 11.442 15.6533 9.56018C15.6533 7.67832 14.1251 6.15277 12.24 6.15277C10.3549 6.15277 8.82667 7.67832 8.82667 9.56018ZM5.2 9.56018V10.1991H12.24V9.56018V8.92129H5.2V9.56018Z" fill="currentColor"/></svg>;

// RIGHT / END Icons (Regular / Rotated)
const IconCapArrowRight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.52 8.94086C5.16654 8.94086 4.88 9.2269 4.88 9.57975C4.88 9.9326 5.16654 10.2186 5.52 10.2186V9.57975V8.94086ZM14.9325 10.0315C15.1825 9.78201 15.1825 9.37749 14.9325 9.12799L12.2722 6.47222C12.0222 6.22272 11.617 6.22272 11.3671 6.47222C11.1171 6.72172 11.1171 7.12624 11.3671 7.37575L13.5749 9.57975L11.3671 11.7838C11.1171 12.0332 11.1171 12.4378 11.3671 12.6873C11.617 12.9368 12.0222 12.9368 12.2722 12.6873L14.9325 10.0315ZM5.52 9.57975V10.2186H14.48V9.57975V8.94086H5.52V9.57975Z" fill="currentColor"/></svg>;

const IconCapSolidRight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.66667 9.18234C5.29848 9.18234 5 9.48081 5 9.849C5 10.2182 5.29848 10.5157 5.66667 10.5157V9.849V9.18234ZM13.5 9.849C13.5 11.2197 12.3874 12.3323 11.0167 12.3323C9.64594 12.3323 8.53333 11.2197 8.53333 9.849C8.53333 8.47829 9.64594 7.36568 11.0167 7.36568C12.3874 7.36568 13.5 8.47829 13.5 9.849ZM5.66667 9.849V10.5157H11.0167V9.849V9.18234H5.66667V9.849Z" fill="currentColor"/></svg>;

const IconCapTriangleRight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotate(180deg)'}}><path d="M5.66667 9.18234C5.29848 9.18234 5 9.48081 5 9.849C5 10.2182 5.29848 10.5157 5.66667 10.5157V9.849V9.18234ZM8.33333 10.5157L13.5692 13.015C14.2329 13.3318 15 12.848 15 12.1126V7.58544C15 6.85003 14.2329 6.36618 13.5692 6.68299L8.33333 9.18234V10.5157ZM5.66667 9.849V10.5157H9V9.849V9.18234H5.66667V9.849Z" fill="currentColor"/></svg>;

const IconCapCircleRight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotate(180deg)'}}><path d="M5.2 8.92129C4.84654 8.92129 4.56 9.20733 4.56 9.56018C4.56 9.91303 4.84654 10.1991 5.2 10.1991V9.56018V8.92129ZM8.82667 9.56018C8.82667 11.442 10.3549 12.9676 12.24 12.9676C14.1251 12.9676 15.6533 11.442 15.6533 9.56018C15.6533 7.67832 14.1251 6.15277 12.24 6.15277C10.3549 6.15277 8.82667 7.67832 8.82667 9.56018ZM5.2 9.56018V10.1991H12.24V9.56018V8.92129H5.2V9.56018Z" fill="currentColor"/></svg>;


// Weight & Stroke Icons from Figma
const IconWeightThin = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.9583 5.43241C12.8304 6.17534 12.2524 6.83665 11.4427 7.35694C10.6139 7.88942 9.44987 8.33823 7.95209 8.62682C6.58066 8.89103 5.66381 9.3174 5.11195 9.75053C4.55402 10.1885 4.42516 10.5801 4.43458 10.8066C4.44301 11.0082 4.56962 11.2668 4.99961 11.4568C5.43901 11.651 6.15767 11.7429 7.15148 11.537C7.51195 11.4623 7.86495 11.694 7.93974 12.0545C8.01445 12.415 7.78276 12.768 7.42224 12.8427C6.24622 13.0864 5.22699 13.0149 4.46033 12.676C3.68448 12.3331 3.13703 11.6891 3.10231 10.8628C3.06881 10.0613 3.52812 9.2991 4.28907 8.70184C5.05644 8.09958 6.19022 7.60792 7.69936 7.31718C9.08179 7.05085 10.0735 6.65146 10.7213 6.23531C11.3881 5.8069 11.6081 5.41899 11.6447 5.20627C11.6677 5.07246 11.6407 4.89257 11.3024 4.70796C10.9335 4.50671 10.2598 4.3598 9.23803 4.449C8.87132 4.4809 8.54807 4.20945 8.51605 3.84272C8.48423 3.47607 8.75565 3.15276 9.12233 3.12075C10.2847 3.01928 11.2541 3.16234 11.9409 3.53698C12.658 3.92819 13.0997 4.61059 12.9583 5.43241Z" fill="currentColor"/></svg>;

const IconWeightMedium = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.2869 6.48901C14.1591 7.23194 13.5811 7.89325 12.7714 8.41354C11.9426 8.94602 10.7786 9.39483 9.28078 9.68342C7.90935 9.94763 6.9925 10.374 6.44064 10.8071C6.03271 11.1189 5.89385 11.3819 5.90327 11.6084C5.9117 11.81 6.03831 12.0686 6.4683 12.2586C6.9077 12.4528 7.62636 12.5447 8.62017 12.3388C8.98064 12.2641 9.33364 12.4958 9.40843 12.8563C9.48314 13.2168 9.25145 13.5698 8.89093 13.6445C7.71491 13.8882 6.69568 13.8167 5.92902 13.4778C5.15317 13.1349 4.60572 12.4909 4.571 11.6646C4.5375 10.8631 4.99681 10.1009 5.75776 9.50364C6.52513 8.90138 7.65891 8.40972 9.16805 8.11898C10.5505 7.85265 11.5422 7.45326 12.19 7.03711C12.8568 6.6087 13.0768 6.22079 13.1134 6.00807C13.1364 5.87426 13.1094 5.69437 12.7711 5.50976C12.4022 5.30851 11.7285 5.1616 10.7067 5.2508C10.34 5.2827 10.0168 5.01125 9.98474 4.64452C9.95292 4.27787 10.2243 3.95456 10.591 3.92255C11.7534 3.82108 12.7228 3.96414 13.4096 4.33878C14.1267 4.72999 14.5684 5.41239 14.2869 6.48901Z" fill="currentColor"/></svg>;

const IconWeightThick = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.6154 7.54562C15.4418 8.55376 14.6842 9.35186 13.8028 9.91814C12.8835 10.5088 11.6334 10.9816 10.0779 11.2813C8.77549 11.5322 7.96826 11.9264 7.52412 12.2749C7.2219 12.5121 7.13563 12.6828 7.11096 12.7535C7.13649 12.7759 7.18354 12.8092 7.26898 12.847C7.54474 12.9689 8.11337 13.0716 9.01622 12.8845C9.73728 12.7351 10.4433 13.1984 10.5927 13.9195C10.742 14.6405 10.2785 15.3457 9.55751 15.4951C8.29048 15.7577 7.12127 15.697 6.19098 15.2858C5.24189 14.8663 4.48384 14.0291 4.43623 12.8902C4.39071 11.8011 5.01484 10.8537 5.87723 10.1769C6.75233 9.49005 7.99531 8.96724 9.57323 8.66322C10.8982 8.40797 11.804 8.03212 12.3613 7.67406C12.636 7.49754 12.7918 7.34854 12.8797 7.24491C12.6224 7.14231 12.1184 7.04169 11.2964 7.11342C10.5629 7.17746 9.91568 6.63467 9.85161 5.90111C9.78757 5.16752 10.3309 4.52064 11.0645 4.4566C12.2971 4.34902 13.4142 4.49076 14.2598 4.95203C15.1663 5.44651 15.8161 6.37974 15.6154 7.54562Z" fill="currentColor"/></svg>;

const IconStrokeStraight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5423 5.52169C13.8026 5.26137 14.2247 5.26144 14.485 5.52169C14.7454 5.78204 14.7454 6.20405 14.485 6.4644L6.47135 14.4781C6.211 14.7384 5.789 14.7384 5.52865 14.4781C5.2684 14.2177 5.26833 13.7957 5.52865 13.5354L13.5423 5.52169Z" fill="currentColor"/></svg>;

const IconStrokeDashed = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.53033 12.5338C6.79068 12.2735 7.21279 12.2735 7.47314 12.5338C7.73349 12.7942 7.73349 13.2163 7.47314 13.4766L6.4714 14.4784C6.21105 14.7387 5.78894 14.7387 5.52859 14.4784C5.26824 14.218 5.26824 13.7959 5.52859 13.5356L6.53033 12.5338ZM10.5373 8.52688C10.7976 8.26653 11.2197 8.26653 11.4801 8.52688C11.7404 8.78723 11.7404 9.20934 11.4801 9.46969L9.47661 11.4732C9.21626 11.7335 8.79415 11.7335 8.5338 11.4732C8.27345 11.2128 8.27345 10.7907 8.5338 10.5303L10.5373 8.52688ZM13.5425 5.52168C13.8028 5.26133 14.2249 5.26133 14.4853 5.52168C14.7456 5.78203 14.7456 6.20414 14.4853 6.46449L13.4835 7.46622C13.2232 7.72657 12.8011 7.72657 12.5407 7.46622C12.2804 7.20587 12.2804 6.78376 12.5407 6.52341L13.5425 5.52168Z" fill="currentColor"/></svg>;


const AnchorControl = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => {
  const positions = [
    { id: 'TOP', class: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
    { id: 'RIGHT', class: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2' },
    { id: 'BOTTOM', class: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
    { id: 'LEFT', class: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2' },
  ];

  return (
    <div className="relative w-20 h-20 bg-muted/20 rounded-lg flex items-center justify-center border border-border">
      <span className="text-xs text-muted-foreground">{label}</span>
      {positions.map((pos) => (
        <button
          key={pos.id}
          onClick={() => onChange(pos.id)}
          className={`absolute w-3 h-3 rounded-full border border-border transition-colors ${pos.class} ${
              value === pos.id ? 'bg-black border-black scale-125' : 'bg-white hover:bg-gray-100'
          }`}
        />
      ))}
    </div>
  );
};

export default function App() {
  // Use defaults - persistence will be handled by backend via figma.clientStorage
  const [selectedColor, setSelectedColor] = useState('#3b82f6'); // Blue
  const [pathType, setPathType] = useState('Angled');
  const [startCap, setStartCap] = useState('None');
  const [endCap, setEndCap] = useState('Arrow-Equilateral'); // Arrow
  const [weight, setWeight] = useState('Thin');
  const [stroke, setStroke] = useState('Solid');
  const [label, setLabel] = useState('');
  
  // Selection State
  const [selectedCount, setSelectedCount] = useState(0);
  const [nodeNames, setNodeNames] = useState<string[]>([]);
  const [anchors, setAnchors] = useState({ source: 'BOTTOM', target: 'TOP' });

  // Sync config with backend
  useEffect(() => {
    parent.postMessage({ 
      pluginMessage: { 
        type: 'update-config',
        payload: { 
          anchors,
          color: selectedColor,
          pathType,
          caps: { start: startCap, end: endCap },
          weight,
          stroke
        }
      } 
    }, '*');
  }, [anchors, selectedColor, pathType, startCap, endCap, weight, stroke]);

  // Unified Message Listener
  useEffect(() => {
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (!msg) return;

      console.log('[UI] Received message:', msg);
      const { type, payload } = msg;

      if (type === 'selection-change') {
        setSelectedCount(payload.count);
        setNodeNames(payload.nodeNames || []);
      } else if (type === 'processing') {
        toast.message("Applying styles...", { duration: 1000 });
      } else if (type === 'connected') {
        toast.success("Connected!", { duration: 2000 });
      } else if (type === 'error') {
        toast.error("Error", { description: payload.message });
      }
    };
    return () => { window.onmessage = null; };
  }, []);

  const colors = [
    '#ef4444', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#737373',
    '#fecaca', '#fde68a', '#bbf7d0', '#bfdbfe', '#e9d5ff', '#e5e5e5'
  ];

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('#')) val = '#' + val.replace('#', '');
    if (val.length > 7) return; // Limit to #RRGGBB
    setSelectedColor(val);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-3 flex flex-col gap-3 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-sm font-semibold text-foreground">Autoflow</h1>
        <p className="text-xs text-muted-foreground">Flows made simple. Copy. Select. Paste.</p>
      </div>

      {/* Select Color */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold">Select color</Label>
        <div className="p-4 border rounded-2xl grid grid-cols-6 gap-4 bg-[#fafafa]">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-[28px] h-[28px] rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                selectedColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Custom Color */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold">Custom color</Label>
        <div className="relative">
          <Input 
            value={selectedColor} 
            onChange={handleCustomColorChange}
            className="pr-10 font-mono text-xs h-8"
            maxLength={7}
          />
          <div 
            className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-border"
            style={{ backgroundColor: selectedColor }}
          />
        </div>
      </div>

      {/* Label */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold">Label</Label>
        <Input 
          placeholder="Add description" 
          className="h-8 text-xs" 
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>

      {/* Path Type */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold">Path Type</Label>
        <Tabs defaultValue="Angled" onValueChange={setPathType} className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-8 p-1 bg-muted rounded-lg">
            <TabsTrigger value="Angled" className="text-xs flex items-center justify-center gap-2 h-6 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
              <IconAngled /> Angled
            </TabsTrigger>
            <TabsTrigger value="Curved" className="text-xs flex items-center justify-center gap-2 h-6 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
              <IconCurved /> Curved
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Caps & Stroke Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Start Cap</Label>
          <Select value={startCap} onValueChange={setStartCap}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None"><div className="flex gap-2"><IconCapNone /><span className="text-xs">None</span></div></SelectItem>
              <SelectItem value="Arrow"><div className="flex gap-2"><IconCapArrowLeft /><span className="text-xs">Arrow</span></div></SelectItem>
              <SelectItem value="Solid"><div className="flex gap-2"><IconCapSolidLeft /><span className="text-xs">Solid</span></div></SelectItem>
              <SelectItem value="Triangle"><div className="flex gap-2"><IconCapTriangleLeft /><span className="text-xs">Triangle</span></div></SelectItem>
              <SelectItem value="Circle"><div className="flex gap-2"><IconCapCircleLeft /><span className="text-xs">Circle</span></div></SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs font-semibold">End Cap</Label>
          <Select value={endCap} onValueChange={setEndCap}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None"><div className="flex gap-2"><IconCapNone /><span className="text-xs">None</span></div></SelectItem>
              <SelectItem value="Arrow"><div className="flex gap-2"><IconCapArrowRight /><span className="text-xs">Arrow</span></div></SelectItem>
              <SelectItem value="Solid"><div className="flex gap-2"><IconCapSolidRight /><span className="text-xs">Solid</span></div></SelectItem>
              <SelectItem value="Triangle"><div className="flex gap-2"><IconCapTriangleRight /><span className="text-xs">Triangle</span></div></SelectItem>
              <SelectItem value="Circle"><div className="flex gap-2"><IconCapCircleRight /><span className="text-xs">Circle</span></div></SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Weight</Label>
          <Select value={weight} onValueChange={setWeight}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Thin"><div className="flex gap-2"><IconWeightThin /><span className="text-xs">Thin</span></div></SelectItem>
              <SelectItem value="Medium"><div className="flex gap-2"><IconWeightMedium /><span className="text-xs">Medium</span></div></SelectItem>
              <SelectItem value="Thick"><div className="flex gap-2"><IconWeightThick /><span className="text-xs">Thick</span></div></SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Stroke</Label>
          <Select value={stroke} onValueChange={setStroke}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Solid"><div className="flex gap-2"><IconStrokeStraight /><span className="text-xs">Solid</span></div></SelectItem>
              <SelectItem value="Dashed"><div className="flex gap-2"><IconStrokeDashed /><span className="text-xs">Dashed</span></div></SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Select two nodes */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold">Select two nodes</Label>
        
        <div className="w-full bg-[#fafafa] border rounded-2xl flex flex-col items-center justify-center p-6 relative min-h-[160px]">
            {selectedCount === 2 ? (
                <>
                    <div className="flex items-center justify-between w-full px-4 mb-4">
                        <div className="flex gap-2 py-2">
                        <AnchorControl 
                          label={nodeNames[0] || 'Node 1'} 
                          value={anchors.source} 
                          onChange={(v) => setAnchors({...anchors, source: v})} 
                        />
                        <AnchorControl 
                          label={nodeNames[1] || 'Node 2'} 
                          value={anchors.target} 
                          onChange={(v) => setAnchors({...anchors, target: v})} 
                        />
                    </div>
                    </div>
                    
                    <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                        Copy a connector (Ctrl+C), then press <strong>Ctrl+V</strong><br/>
                        <span className="text-[9px]">Selection will auto-clear for clean paste</span>
                    </p>
                </>
            ) : (
               <div className="text-center p-2">
                   <p className="text-xs text-muted-foreground font-medium max-w-[200px] leading-relaxed">
                       1. Copy any connector (Ctrl+C)<br/>
                       2. Select two nodes<br/>
                       3. Press Ctrl+V
                   </p>
                   <p className="text-[9px] text-muted-foreground mt-1">
                       ✨ Automatic paste & connect
                   </p>
               </div>
            )}
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}
