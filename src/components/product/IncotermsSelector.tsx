import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Ship, Truck, Globe, ChevronRight } from "lucide-react";

interface IncotermsSelectorProps {
  value: string;
  onChange: (value: string) => void;
  portLocation: string;
  onPortLocationChange: (value: string) => void;
  destinationCountry: string;
  onDestinationCountryChange: (value: string) => void;
}

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

      {/* FOB Selected - Show FOB on left, input on right */}
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
          
          <div className="flex-1">
            <Label className="text-foreground mb-1.5 block text-xs">
              Destination Port *
            </Label>
            <Input
              type="text"
              placeholder="e.g., Rotterdam, Netherlands"
              value={portLocation}
              onChange={(e) => onPortLocationChange(e.target.value)}
              className="bg-muted/50 border-border text-sm h-10"
            />
          </div>
        </div>
      )}

      {/* CIF Selected - Show CIF on left, input on right */}
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
          
          <div className="flex-1">
            <Label className="text-foreground mb-1.5 block text-xs">
              Destination Country *
            </Label>
            <Input
              type="text"
              placeholder="e.g., United States"
              value={destinationCountry}
              onChange={(e) => onDestinationCountryChange(e.target.value)}
              className="bg-muted/50 border-border text-sm h-10"
            />
          </div>
        </div>
      )}

      {/* Incoterms Info */}
      <p className="text-xs text-muted-foreground mt-3">
        {value === "exw" && "Ex Works: Buyer arranges all transportation from seller's location."}
        {value === "fob" && "FOB: Seller delivers to the port, buyer arranges shipping from there."}
        {value === "cif" && "CIF: Seller covers cost, insurance & freight to destination country."}
      </p>
    </div>
  );
};

export default IncotermsSelector;
