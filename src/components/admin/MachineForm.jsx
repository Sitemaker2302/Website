import React, { useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image } from "@/components/ui/image";
import { createMachine, updateMachine, uploadMachinePhoto } from "@/lib/inventoryService";
import { config } from "@/lib/config";

const EMPTY = {
  manufacturer: "",
  model: "",
  year: "",
  operatingHours: "",
  price: "",
  currency: config.currency,
  condition: "Used",
  location: "",
  locationEn: "",
  description: "",
  descriptionJp: "",
  category: "",
  photos: [],
  availability: "available",
};
