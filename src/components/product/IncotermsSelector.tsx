import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Ship, Truck, Globe } from "lucide-react";

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
  return (
    <div className="card-glass p-4 rounded-xl mb-4">
      <Label className="text-foreground mb-3 block text-sm font-semibold flex items-center gap-2">
        <Globe className="w-4 h-4 text-primary" />
        Incoterms
      </Label>
      
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-3 gap-2"
      >
        <div className="relative">
          <RadioGroupItem value="exw" id="exw" className="peer sr-only" />
          <Label
            htmlFor="exw"
            className="flex flex-col items-center gap-1 p-3 rounded-lg border-2 border-border cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
          >
            <Truck className="w-5 h-5 text-muted-foreground peer-data-[state=checked]:text-primary" />
            <span className="text-xs font-medium">Ex Works</span>
          </Label>
        </div>
        
        <div className="relative">
          <RadioGroupItem value="fob" id="fob" className="peer sr-only" />
          <Label
            htmlFor="fob"
            className="flex flex-col items-center gap-1 p-3 rounded-lg border-2 border-border cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
          >
            <Ship className="w-5 h-5 text-muted-foreground peer-data-[state=checked]:text-primary" />
            <span className="text-xs font-medium">FOB</span>
          </Label>
        </div>
        
        <div className="relative">
          <RadioGroupItem value="cif" id="cif" className="peer sr-only" />
          <Label
            htmlFor="cif"
            className="flex flex-col items-center gap-1 p-3 rounded-lg border-2 border-border cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
          >
            <Globe className="w-5 h-5 text-muted-foreground peer-data-[state=checked]:text-primary" />
            <span className="text-xs font-medium">CIF</span>
          </Label>
        </div>
      </RadioGroup>

      {/* FOB - Port Location Input */}
      {value === "fob" && (
        <div className="mt-3 animate-fade-in">
          <Label className="text-foreground mb-2 block text-xs">
            Destination Port Location *
          </Label>
          <Input
            type="text"
            placeholder="e.g., Rotterdam, Netherlands"
            value={portLocation}
            onChange={(e) => onPortLocationChange(e.target.value)}
            className="bg-muted/50 border-border text-sm"
          />
        </div>
      )}

      {/* CIF - Destination Country Input */}
      {value === "cif" && (
        <div className="mt-3 animate-fade-in">
          <Label className="text-foreground mb-2 block text-xs">
            Destination Country *
          </Label>
          <Input
            type="text"
            placeholder="e.g., United States"
            value={destinationCountry}
            onChange={(e) => onDestinationCountryChange(e.target.value)}
            className="bg-muted/50 border-border text-sm"
          />
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
