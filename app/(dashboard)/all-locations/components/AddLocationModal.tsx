"use client";

import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import {
  useGetDealersQuery,
  useCreateLocationMutation,
  useGetUnassignedDealersQuery, // ✅ NEW
} from "@/app/store/api/authApi";

export function AddLocationModal() {

  const { data: dealersData, isLoading } = useGetUnassignedDealersQuery();
  const [createLocation, { isLoading: isCreating }] = useCreateLocationMutation();

  const [locationName, setLocationName] = useState("");
  const [selectedDealers, setSelectedDealers] = useState<number[]>([]);

  const dealers = dealersData?.data || [];
  console.log("Dealers:", dealers);

  const toggleDealer = (id: number) => {
    setSelectedDealers((prev) =>
      prev.includes(id)
        ? prev.filter((d) => d !== id)
        : [...prev, id]
    );
  };

  // ✅ SUBMIT API CALL
  const handleSubmit = async () => {
    if (!locationName) {
      alert("Location name is required");
      return;
    }

    if (selectedDealers.length === 0) {
      alert("Select at least one dealer");
      return;
    }

    const payload = {
      location_name: locationName,
      dealers: selectedDealers,
    };

    try {
      const res = await createLocation(payload).unwrap();

      console.log("Success:", res);
      alert("Location created successfully ✅");

      // ✅ reset form
      setLocationName("");
      setSelectedDealers([]);

    } catch (error: any) {
      console.error("Error:", error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-slate-800 text-white gap-1.5">
          <Plus className="w-4 h-4" /> Add Location
        </Button>
      </DialogTrigger>

      <DialogContent className="!max-w-[500px] w-[90vw] p-0 rounded-2xl flex flex-col">

        {/* HEADER */}
        <div className="flex items-center gap-3 px-6 py-4 bg-muted/40 border-b">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-slate-800 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white " />
          </div>
          <div>
            <DialogTitle className="text-sm font-medium">
              Add Location
            </DialogTitle>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">

          {/* Location Name */}
          <div>
            <Label className="text-xs">Location Name</Label>
            <Input
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Enter location name"
            />
          </div>

          {/* Dealers */}
          <div>
            <Label className="text-xs">Select Dealers</Label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full mt-2">
                  {selectedDealers.length > 0
                    ? `${selectedDealers.length} dealer(s) selected`
                    : "Select Dealers"}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                
                {isLoading && <p className="p-2 text-xs">Loading...</p>}

                {!isLoading && dealers.length === 0 && (
                  <p className="p-2 text-xs">No dealers found</p>
                )}

                {dealers.map((dealer: any) => (
                  <DropdownMenuCheckboxItem
                    key={dealer.id}
                    checked={selectedDealers.includes(dealer.id)}
                    onCheckedChange={() => toggleDealer(dealer.id)}
                  >
                    {dealer.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button className="bg-gradient-to-r from-cyan-500 to-slate-800" onClick={handleSubmit} disabled={isCreating}>
            {isCreating ? "Saving..." : "Save Location"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}