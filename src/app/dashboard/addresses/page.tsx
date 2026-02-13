"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Home,
  Building2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    fullName: "John Doe",
    phone: "+1 (555) 123-4567",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "US",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Office",
    fullName: "John Doe",
    phone: "+1 (555) 987-6543",
    street: "456 Business Ave, Suite 200",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    country: "US",
    isDefault: false,
  },
];

const emptyForm: Omit<Address, "id"> = {
  label: "",
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
  isDefault: false,
};

const countries = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "UK", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "JP", label: "Japan" },
  { value: "IN", label: "India" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form, setForm] = useState<Omit<Address, "id">>(emptyForm);

  const openNewDialog = () => {
    setEditingAddress(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setForm({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      isDefault: address.isDefault,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.fullName || !form.street || !form.city || !form.state || !form.zip) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((addr) => {
          if (addr.id === editingAddress.id) {
            return { ...addr, ...form };
          }
          if (form.isDefault && addr.id !== editingAddress.id) {
            return { ...addr, isDefault: false };
          }
          return addr;
        })
      );
      toast.success("Address updated successfully.");
    } else {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        ...form,
      };
      setAddresses((prev) => {
        let updated = [...prev, newAddress];
        if (form.isDefault) {
          updated = updated.map((a) =>
            a.id === newAddress.id ? a : { ...a, isDefault: false }
          );
        }
        return updated;
      });
      toast.success("Address added successfully.");
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditingAddress(null);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address deleted successfully.");
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    toast.success("Default address updated.");
  };

  const getIcon = (label: string) => {
    if (label.toLowerCase() === "home") return Home;
    if (label.toLowerCase() === "office") return Building2;
    return MapPin;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Addresses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your shipping and billing addresses.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
              <DialogDescription>
                {editingAddress
                  ? "Update the details of your address."
                  : "Add a new shipping or billing address."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="label">Address Label</Label>
                <Input
                  id="label"
                  placeholder="e.g. Home, Office, etc."
                  value={form.label}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, label: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  placeholder="123 Main St"
                  value={form.street}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, street: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={form.city}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, city: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={form.state}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, state: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="zip">Zip Code *</Label>
                  <Input
                    id="zip"
                    placeholder="10001"
                    value={form.zip}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, zip: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Country</Label>
                  <Select
                    value={form.country}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, country: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="isDefault"
                  checked={form.isDefault}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      isDefault: checked === true,
                    }))
                  }
                />
                <Label htmlFor="isDefault" className="text-sm font-normal">
                  Set as default address
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingAddress ? "Update Address" : "Save Address"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Address Grid */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 sm:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {addresses.map((address) => {
            const Icon = getIcon(address.label);
            return (
              <motion.div
                key={address.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="relative overflow-hidden transition-shadow hover:shadow-md">
                  {address.isDefault && (
                    <div className="absolute right-0 top-0">
                      <div className="flex h-6 items-center gap-1 rounded-bl-lg bg-primary px-2.5 text-[10px] font-medium text-primary-foreground">
                        <Check className="h-3 w-3" />
                        Default
                      </div>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-base">{address.label || "Address"}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{address.fullName}</p>
                      <p className="text-muted-foreground">{address.street}</p>
                      <p className="text-muted-foreground">
                        {address.city}, {address.state} {address.zip}
                      </p>
                      {address.phone && (
                        <p className="text-muted-foreground">{address.phone}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(address)}
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Address</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this address? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => handleDelete(address.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      {!address.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {addresses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No addresses yet</h3>
          <p className="mb-6 text-sm text-muted-foreground max-w-sm">
            Add your first address to make checkout faster and easier.
          </p>
          <Button onClick={openNewDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
