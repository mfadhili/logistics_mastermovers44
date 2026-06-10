/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RelocationBrief, InventoryPreset } from './types';

export const INVENTORY_PRESETS: InventoryPreset[] = [
  // LOUNGE & LIVING ROOM
  { id: 'lounge_3_seater', name: '3 Seated Sofa', category: 'Lounge', volumeCbm: 1.8 },
  { id: 'lounge_2_seater', name: '2 Seated Sofa', category: 'Lounge', volumeCbm: 1.2 },
  { id: 'lounge_1_seater', name: '1 Seated Sofa', category: 'Lounge', volumeCbm: 0.8 },
  { id: 'lounge_arm_chair', name: 'Arm Chair', category: 'Lounge', volumeCbm: 0.6 },
  { id: 'lounge_coffee_table', name: 'Coffee Table', category: 'Lounge', volumeCbm: 0.4 },
  { id: 'lounge_occasional_table', name: 'Occasional Table', category: 'Lounge', volumeCbm: 0.2 },
  { id: 'lounge_tv_cabinet', name: 'TV Cabinet', category: 'Lounge', volumeCbm: 0.8 },
  { id: 'lounge_tv', name: 'TV', category: 'Lounge', volumeCbm: 0.3 },
  { id: 'lounge_piano_upright', name: 'Piano - Upright', category: 'Lounge', volumeCbm: 3.5 },
  { id: 'lounge_piano_baby_grand', name: 'Piano - Baby grand', category: 'Lounge', volumeCbm: 4.5 },
  { id: 'lounge_bookcase', name: 'Bookcase', category: 'Lounge', volumeCbm: 1.0 },
  { id: 'lounge_pictures', name: 'Pictures/Paintings', category: 'Lounge', volumeCbm: 0.1 },

  // DINING ROOM
  { id: 'dining_table', name: 'Table', category: 'Dining Room', volumeCbm: 1.5 },
  { id: 'dining_chairs', name: 'Chairs', category: 'Dining Room', volumeCbm: 0.2 },
  { id: 'dining_sideboard', name: 'Sideboard', category: 'Dining Room', volumeCbm: 1.2 },
  { id: 'dining_server', name: 'Server', category: 'Dining Room', volumeCbm: 1.0 },
  { id: 'dining_welsh_dresser', name: 'Welsh Dresser', category: 'Dining Room', volumeCbm: 1.5 },

  // STUDY
  { id: 'study_desk', name: 'Desk/ L Shaped', category: 'Study', volumeCbm: 1.5 },
  { id: 'study_office_chair', name: 'Office Chairs', category: 'Study', volumeCbm: 0.3 },
  { id: 'study_computer', name: 'Computer/ Printer', category: 'Study', volumeCbm: 0.2 },
  { id: 'study_bookcase', name: 'Bookcase', category: 'Study', volumeCbm: 1.0 },
  { id: 'study_filing_cabinet', name: 'Filing Cabinet', category: 'Study', volumeCbm: 0.5 },

  // KITCHEN & APPLIANCES
  { id: 'kitchen_fridge_single', name: 'Fridge Single', category: 'Kitchen & Appliances', volumeCbm: 1.0 },
  { id: 'kitchen_chest_freezer', name: 'Chest Deep Freeze', category: 'Kitchen & Appliances', volumeCbm: 1.2 },
  { id: 'kitchen_dishwasher', name: 'Dishwasher', category: 'Kitchen & Appliances', volumeCbm: 0.6 },
  { id: 'kitchen_washing_machine', name: 'Washing Machine', category: 'Kitchen & Appliances', volumeCbm: 0.6 },
  { id: 'kitchen_tumble_dryer', name: 'Tumble Dryers', category: 'Kitchen & Appliances', volumeCbm: 0.6 },
  { id: 'kitchen_microwave', name: 'Microwave', category: 'Kitchen & Appliances', volumeCbm: 0.2 },
  
  // BEDROOMS
  { id: 'bed_queen', name: 'Bed: Queen', category: 'Bedrooms', volumeCbm: 2.2 },
  { id: 'bed_double', name: 'Beds: Double', category: 'Bedrooms', volumeCbm: 2.0 },
  { id: 'bed_bunk', name: 'Bunk Beds', category: 'Bedrooms', volumeCbm: 2.5 },
  { id: 'bed_pedestals', name: 'Pedestals', category: 'Bedrooms', volumeCbm: 0.2 },
  { id: 'bed_dressing_table', name: 'Dressing Table & Stool', category: 'Bedrooms', volumeCbm: 0.8 },
  { id: 'bed_wardrobe', name: 'Wardrobe', category: 'Bedrooms', volumeCbm: 1.8 },
  { id: 'bed_chest_drawers', name: 'Chest of Drawers', category: 'Bedrooms', volumeCbm: 0.8 },

  // GARAGE & GARDEN
  { id: 'garage_workbench', name: 'Work Bench', category: 'Garage & Garden', volumeCbm: 1.2 },
  { id: 'garage_tool_box', name: 'Tool Box', category: 'Garage & Garden', volumeCbm: 0.3 },
  { id: 'garage_lawnmower', name: 'Lawnmower', category: 'Garage & Garden', volumeCbm: 0.5 },
  { id: 'garage_generator', name: 'Generator', category: 'Garage & Garden', volumeCbm: 0.8 },
  { id: 'garden_pot_large', name: 'Pot Plants Large', category: 'Garage & Garden', volumeCbm: 0.4 },
  { id: 'garden_weber_braai', name: 'Weber Braai', category: 'Garage & Garden', volumeCbm: 0.5 },
  { id: 'garden_patio_table', name: 'Patio Table', category: 'Garage & Garden', volumeCbm: 1.0 },

  // MISCELLANEOUS / BOXES
  { id: 'misc_suitcases', name: 'Suitcases', category: 'Miscellaneous', volumeCbm: 0.2 },
  { id: 'misc_bicycles', name: 'Bicycles', category: 'Miscellaneous', volumeCbm: 0.5 },
  { id: 'box_packed', name: 'Packed Boxes', category: 'Miscellaneous', volumeCbm: 0.15 },
  { id: 'box_delicates', name: 'Fragile Box (Delicates)', category: 'Miscellaneous', volumeCbm: 0.2 },
];

export const OFFICE_LOCATIONS = [
  {
    id: 'jhb',
    name: 'Master Movers Johannesburg',
    short: 'JHB',
    phone: '+27 11 493 7569',
    email: 'sales1@mastermoversjhb.co.za',
    address: '17 Indianapolis Boulevard, Raceway Industrial Park, Gosforth Park, Germiston',
    coordinates: { lat: -26.2309, lng: 28.1812 }
  },
  {
    id: 'cpt',
    name: 'Master Movers Cape Town',
    short: 'CPT',
    phone: '+27 21 534 1582',
    email: 'sales@mastermoverscpt.co.za',
    address: 'Unit 1 Bosal Park, 77 Bofors Circle, Epping Industria, Western Cape, South Africa',
    coordinates: { lat: -33.9249, lng: 18.5412 }
  },
  {
    id: 'dbn',
    name: 'Master Movers Kwazulu Natal',
    short: 'DBN',
    phone: '+27 31 700 8380',
    email: 'sales@mastermoversdbn.co.za',
    address: 'Units 5 & 6 Raddical Park, 3 Gourly Road, Ballito, 4420, Ballito Service Park',
    coordinates: { lat: -29.8587, lng: 31.0218 }
  }
];

export const INITIAL_BRIEFS: RelocationBrief[] = [
  {
    id: 'BRIEF-1998A',
    fullName: 'Linda Miller',
    email: 'linda.miller@private-clients.com',
    phone: '+27 82 455 1290',
    origin: 'Johannesburg',
    destination: 'Cape Town',
    operationalBrief: 'Include White-glove handling for private assets and artworks. 5 high-value boxes + antique dresser.',
    status: 'SETTLED',
    createdAt: '2026-05-15T09:00:00Z',
    inventoryCountEstimate: 14,
    estimatedVolumeCbm: 16.4,
    calculatedCostZar: 42500,
    trackingStep: 4,
    selectedItems: { 'lounge_3_seater': 1, 'bed_queen': 1, 'box_delicates': 5, 'lounge_tv_cabinet': 1, 'kitchen_fridge_single': 1, 'box_packed': 5 },
    specialHandlingNeeded: true
  },
  {
    id: 'BRIEF-2026B',
    fullName: 'Rene Dreyer',
    email: 'r.dreyer@executive-board.co.za',
    phone: '+27 71 890 5312',
    origin: 'Johannesburg',
    destination: 'Durban',
    operationalBrief: 'Executive corporate office relocation simulation assets. Needs priority storage and overnight transit.',
    status: 'IN_TRANSIT',
    createdAt: '2026-05-30T14:30:00Z',
    inventoryCountEstimate: 22,
    estimatedVolumeCbm: 38.6,
    calculatedCostZar: 94800,
    trackingStep: 2,
    selectedItems: { 'dining_table': 2, 'bed_queen': 2, 'lounge_3_seater': 2, 'kitchen_fridge_single': 1, 'kitchen_washing_machine': 1, 'box_packed': 10, 'lounge_piano_baby_grand': 1 },
    specialHandlingNeeded: true
  }
];
