import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Checkbox } from '@/components/ui/checkbox';

import { 
  AngledIcon, 
  CurvedIcon, 
  NoneIcon, 
  LineArrow180Icon, 
  LineArrowIcon, 
  SolidArrow180Icon, 
  SolidArrowIcon, 
  Triangle180Icon, 
  TriangleIcon, 
  Circle180Icon, 
  CircleIcon, 
  ThinIcon, 
  ThickIcon, 
  StraightIcon, 
  DashedIcon 
} from '@/components/icons';

// ─────────────────────────────────────────────────────────────────────────────
// ANCHOR CONTROL COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const AnchorControl = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => {
  const positions = [
    { id: 'TOP', class: 'top-[-26px] left-1/2 -translate-x-1/2' },
    { id: 'RIGHT', class: 'top-1/2 right-[-26px] -translate-y-1/2' },
    { id: 'BOTTOM', class: 'bottom-[-26px] left-1/2 -translate-x-1/2' },
    { id: 'LEFT', class: 'top-1/2 left-[-26px] -translate-y-1/2' },
  ];

  return (
    <div className="relative flex items-center justify-center">
      {/* Node Container */}
      <div className="w-[72px] h-[56px] bg-[#d4d4d4] rounded-[8px] flex items-center justify-center border border-transparent">
        <span className="text-[11px] text-[#171717] font-semibold truncate px-2 text-center leading-tight">{label}</span>
      </div>
      
      {/* Anchor Points (Radios) */}
      {positions.map((pos) => (
        <button
          key={pos.id}
          onClick={() => onChange(pos.id)}
          className={`absolute flex items-center justify-center w-5 h-5 rounded-full border border-[#d4d4d4] bg-white transition-all hover:border-[#a3a3a3] ${pos.class}`}
        >
          {value === pos.id && (
            <div className="w-2.5 h-2.5 rounded-full bg-[#171717]" />
          )}
        </button>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  // State
  const [selectedColor, setSelectedColor] = useState('#0ea5e9');
  const [pathType, setPathType] = useState('Angled');
  const [startCap, setStartCap] = useState('None');
  const [endCap, setEndCap] = useState('None');
  const [weight, setWeight] = useState('Thin');
  const [stroke, setStroke] = useState('Straight');
  const [label, setLabel] = useState('');
  const [deleteOnNodeDelete, setDeleteOnNodeDelete] = useState(true);
  
  // Selection State
  const [nodeNames, setNodeNames] = useState<string[]>([]);
  const [anchors, setAnchors] = useState({ source: 'BOTTOM', target: 'LEFT' });

  // Color palette matching Figma design
  const colors = [
    '#ef4444', '#f97316', '#22c55e', '#3b82f6', '#a855f7', '#171717',
    '#fca5a5', '#fdba74', '#86efac', '#93c5fd', '#d8b4fe', '#d4d4d4'
  ];

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
          stroke,
          deleteOnNodeDelete
        }
      } 
    }, '*');
  }, [anchors, selectedColor, pathType, startCap, endCap, weight, stroke, deleteOnNodeDelete]);

  // Message listener
  useEffect(() => {
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (!msg) return;

      console.log('[UI] Received message:', msg);
      const { type, payload } = msg;

      if (type === 'selection-change') {
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

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('#')) val = '#' + val.replace('#', '');
    if (val.length > 7) return;
    setSelectedColor(val);
  };

  const handleCopyConnector = () => {
    parent.postMessage({ pluginMessage: { type: 'copy-connector' } }, '*');
    toast.success("Connector copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-white text-[#171717] p-4 flex flex-col gap-4 font-sans antialiased">
      
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* HEADER */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col">
        <h1 className="text-[14px] font-bold text-[#171717] tracking-tight">Autoflow</h1>
        <p className="text-[11px] text-[#737373] tracking-tight leading-tight">FigJam connectors, one click away</p>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SELECT COLOR */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold text-[#171717]">Select color</Label>
        <div className="p-3 border border-[#f0f0f0] rounded-xl grid grid-cols-6 gap-3 bg-[#fafafa]">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={cn(
                "w-[26px] h-[26px] rounded-full transition-all hover:opacity-80 focus:outline-none",
                selectedColor === color ? "ring-2 ring-offset-2 ring-[#171717]" : ""
              )}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* CUSTOM COLOR */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold text-[#171717]">Custom color</Label>
        <div className="relative">
          <Input 
            value={selectedColor} 
            onChange={handleCustomColorChange}
            className="h-8 text-[11.5px] font-mono pr-10 border-[#f0f0f0] rounded-[6px]"
            maxLength={7}
          />
          <div 
            className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-[#f0f0f0]"
            style={{ backgroundColor: selectedColor }}
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* LABEL */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold text-[#171717]">Label</Label>
        <Input 
          placeholder="Add description" 
          className="h-8 text-[11.5px] border-[#f0f0f0] rounded-[6px]" 
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* PATH TYPE */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold text-[#171717]">Path Type</Label>
        <Tabs value={pathType} onValueChange={setPathType} className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-9 p-0.5 bg-[#f5f5f5] rounded-lg">
            <TabsTrigger 
              value="Angled" 
              className="text-[12px] h-[32px] rounded-md gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
            >
              <AngledIcon size={16} /> Angled
            </TabsTrigger>
            <TabsTrigger 
              value="Curved" 
              className="text-[12px] h-[32px] rounded-md gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
            >
              <CurvedIcon size={16} /> Curved
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* START CAP / END CAP */}
      {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-[#171717]">Start Cap</Label>
          <Select value={startCap} onValueChange={setStartCap}>
            <SelectTrigger className="border-[#d4d4d4]">
              <SelectValue placeholder="Select start cap" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-[#d4d4d4] min-w-[140px]">
              <SelectItem value="None">
                <div className="flex items-center gap-1.5">
                  <NoneIcon size={16} />
                  <span className="text-[11px]">None</span>
                </div>
              </SelectItem>
              <SelectItem value="Arrow">
                <div className="flex items-center gap-1.5">
                  <LineArrow180Icon size={16} />
                  <span className="text-[11px]">Arrow</span>
                </div>
              </SelectItem>
              <SelectItem value="Solid">
                <div className="flex items-center gap-1.5">
                  <SolidArrow180Icon size={16} />
                  <span className="text-[11px]">Solid</span>
                </div>
              </SelectItem>
              <SelectItem value="Triangle">
                <div className="flex items-center gap-1.5">
                  <Triangle180Icon size={16} />
                  <span className="text-[11px]">Triangle</span>
                </div>
              </SelectItem>
              <SelectItem value="Circle">
                <div className="flex items-center gap-1.5">
                  <Circle180Icon size={16} />
                  <span className="text-[11px]">Circle</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-[#171717]">End Cap</Label>
          <Select value={endCap} onValueChange={setEndCap}>
            <SelectTrigger className="border-[#d4d4d4]">
              <SelectValue placeholder="Select end cap" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-[#d4d4d4] min-w-[140px]">
              <SelectItem value="None">
                <div className="flex items-center gap-1.5">
                  <NoneIcon size={16} />
                  <span className="text-[11px]">None</span>
                </div>
              </SelectItem>
              <SelectItem value="Arrow">
                <div className="flex items-center gap-1.5">
                  <LineArrowIcon size={16} />
                  <span className="text-[11px]">Arrow</span>
                </div>
              </SelectItem>
              <SelectItem value="Solid">
                <div className="flex items-center gap-1.5">
                  <SolidArrowIcon size={16} />
                  <span className="text-[11px]">Solid</span>
                </div>
              </SelectItem>
              <SelectItem value="Triangle">
                <div className="flex items-center gap-1.5">
                  <TriangleIcon size={16} />
                  <span className="text-[11px]">Triangle</span>
                </div>
              </SelectItem>
              <SelectItem value="Circle">
                <div className="flex items-center gap-1.5">
                  <CircleIcon size={16} />
                  <span className="text-[11px]">Circle</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* WEIGHT / STROKE */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-[#171717]">Weight</Label>
          <Select value={weight} onValueChange={setWeight}>
            <SelectTrigger className="border-[#d4d4d4]">
              <SelectValue placeholder="Select weight" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-[#d4d4d4] min-w-[140px]">
              <SelectItem value="Thin">
                <div className="flex items-center gap-1.5">
                  <ThinIcon size={16} />
                  <span className="text-[11px]">Thin</span>
                </div>
              </SelectItem>
              <SelectItem value="Thick">
                <div className="flex items-center gap-1.5">
                  <ThickIcon size={16} />
                  <span className="text-[11px]">Thick</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-[#171717]">Stroke</Label>
          <Select value={stroke} onValueChange={setStroke}>
            <SelectTrigger className="border-[#d4d4d4]">
              <SelectValue placeholder="Select stroke" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-[#d4d4d4] min-w-[140px]">
              <SelectItem value="Straight">
                <div className="flex items-center gap-1.5">
                  <StraightIcon size={16} />
                  <span className="text-[11px]">Straight</span>
                </div>
              </SelectItem>
              <SelectItem value="Dashed">
                <div className="flex items-center gap-1.5">
                  <DashedIcon size={16} />
                  <span className="text-[11px]">Dashed</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SELECT TWO NODES */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="p-3 pb-4 border border-[#f0f0f0] rounded-xl bg-[#fafafa]">
          <div className="flex items-center justify-between px-6 pt-7 mb-7">
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
          <p className="text-[11px] text-[#737373] text-center font-medium">
            Select the connection point on each node
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* DELETE OPTION */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="delete-connector" 
          checked={deleteOnNodeDelete} 
          onCheckedChange={(checked) => setDeleteOnNodeDelete(checked === true)}
          className="border-[#d4d4d4] data-[state=checked]:bg-[#171717] data-[state=checked]:border-[#171717]"
        />
        <label
          htmlFor="delete-connector"
          className="text-[11px] font-medium leading-none text-[#737373] cursor-pointer"
        >
          Delete connector when node is deleted
        </label>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* COPY CONNECTOR */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="space-y-2 mt-auto pt-2">
        <div className="space-y-0.5">
          <Label className="text-[11.5px] font-bold text-[#171717]">Copy connector to clipboard</Label>
          <p className="text-[11px] text-[#a3a3a3] font-medium">Requires a connector in your clipboard to function</p>
        </div>
        <Button 
          onClick={handleCopyConnector}
          className="w-full h-9 bg-[#171717] hover:bg-black text-white text-[12.5px] font-bold rounded-[6px] transition-colors"
        >
          Click here to copy
        </Button>
      </div>
      
      <Toaster />
    </div>
  );
}
