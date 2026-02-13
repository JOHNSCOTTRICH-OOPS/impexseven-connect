import { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Ship, Truck, Globe, ChevronRight, MapPin } from "lucide-react";

const popularPorts = [
  "Rotterdam, Netherlands",
  "Hamburg, Germany",
  "Antwerp, Belgium",
  "Felixstowe, UK",
  "Jebel Ali, UAE",
  "Singapore",
  "Shanghai, China",
  "Busan, South Korea",
  "Yokohama, Japan",
  "Los Angeles, USA",
  "New York, USA",
  "Santos, Brazil",
  "Colombo, Sri Lanka",
  "Mombasa, Kenya",
  "Durban, South Africa",
];

const popularCountries = [
  "United States",
  "United Kingdom",
  "Germany",
  "Netherlands",
  "France",
  "United Arab Emirates",
  "Saudi Arabia",
  "Singapore",
  "Japan",
  "South Korea",
  "China",
  "Australia",
  "Canada",
  "Brazil",
  "South Africa",
  "Kenya",
  "Sri Lanka",
  "Malaysia",
];

interface IncotermsSelectorProps {
  value: string;
  onChange: (value: string) => void;
  portLocation: string;
  onPortLocationChange: (value: string) => void;
  destinationCountry: string;
  onDestinationCountryChange: (value: string) => void;
}

const AutocompleteInput = ({
  value,
  onChange,
  suggestions,
  placeholder,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  placeholder: string;
  label: string;
}) => {
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const q = value.trim().toLowerCase();
  const filtered = q
    ? suggestions.filter((s) => s.toLowerCase().includes(q)).slice(0, 6)
    : suggestions.slice(0, 6);

  const showDropdown = focused && filtered.length > 0 && value !== filtered[0];

  return (
    <div ref={containerRef} className="flex-1 relative">
      <Label className="text-foreground mb-1.5 block text-xs">{label}</Label>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        className="bg-muted/50 border-border text-sm h-10"
      />
      {showDropdown && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-xl shadow-lg z-[100] overflow-hidden animate-in fade-in-0 slide-in-from-bottom-1 duration-150 max-h-48 overflow-y-auto">
          {filtered.map((item) => {
            const idx = item.toLowerCase().indexOf(q);
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  onChange(item);
                  setFocused(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors text-left text-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-foreground">
                  {idx >= 0 ? (
                    <>
                      {item.slice(0, idx)}
                      <span className="font-bold text-primary">{item.slice(idx, idx + q.length)}</span>
                      {item.slice(idx + q.length)}
                    </>
                  ) : (
                    item
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const IncotermsSelector = ({
  value,
  onChange,
  portLocation,
  onPortLocationChange,
  destinationCountry,
  onDestinationCountryChange,
}: IncotermsSelectorProps) => {
  const isExpanded = value === "fob" || value === "cif";

  const handleSelect = (term: string) => {
    if (value === term) {
      onChange("exw");
    } else {
      onChange(term);
    }
  };

  return (
    <div className="card-glass p-4 rounded-xl mb-4">
      <Label className="text-foreground mb-3 block text-sm font-semibold flex items-center gap-2">
        <Globe className="w-4 h-4 text-primary" />
        Incoterms
      </Label>
      
      {/* Default State - Show all 3 options */}
      {!isExpanded && (
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleSelect("exw")}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              value === "exw" 
                ? "border-primary bg-primary/10" 
                : "border-border hover:border-primary/50"
            }`}
          >
            <Truck className={`w-5 h-5 ${value === "exw" ? "text-primary" : "text-muted-foreground"}`} />
            <span className="text-xs font-medium">Ex Works</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleSelect("fob")}
            className="flex flex-col items-center gap-1 p-3 rounded-lg border-2 border-border cursor-pointer transition-all hover:border-primary/50"
          >
            <Ship className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs font-medium">FOB</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleSelect("cif")}
            className="flex flex-col items-center gap-1 p-3 rounded-lg border-2 border-border cursor-pointer transition-all hover:border-primary/50"
          >
            <Globe className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs font-medium">CIF</span>
          </button>
        </div>
      )}

      {/* FOB Selected */}
      {value === "fob" && (
        <div className="flex items-stretch gap-2 animate-fade-in">
          <button
            type="button"
            onClick={() => handleSelect("fob")}
            className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg border-2 border-primary bg-primary/10 cursor-pointer transition-all min-w-[80px]"
          >
            <Ship className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium">FOB</span>
          </button>
          
          <ChevronRight className="w-5 h-5 text-muted-foreground self-center flex-shrink-0" />
          
          <AutocompleteInput
            value={portLocation}
            onChange={onPortLocationChange}
            suggestions={popularPorts}
            placeholder="e.g., Rotterdam, Netherlands"
            label="Destination Port *"
          />
        </div>
      )}

      {/* CIF Selected */}
      {value === "cif" && (
        <div className="flex items-stretch gap-2 animate-fade-in">
          <button
            type="button"
            onClick={() => handleSelect("cif")}
            className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg border-2 border-primary bg-primary/10 cursor-pointer transition-all min-w-[80px]"
          >
            <Globe className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium">CIF</span>
          </button>
          
          <ChevronRight className="w-5 h-5 text-muted-foreground self-center flex-shrink-0" />
          
          <AutocompleteInput
            value={destinationCountry}
            onChange={onDestinationCountryChange}
            suggestions={popularCountries}
            placeholder="e.g., United States"
            label="Destination Country *"
          />
        </div>
      )}
    </div>
  );
};

export default IncotermsSelector;
