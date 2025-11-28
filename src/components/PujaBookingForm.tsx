import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';

import { Plus, Trash2, CreditCard, ShieldCheck, AlertCircle, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';

interface FamilyMember {
    name: string;
    relation: string;
}

interface PujaBookingFormProps {
    isOpen: boolean;
    onClose: () => void;
    pujaName: string;
    packageDetails?: {
        name: string;
        price: number;
    };
}

const ADDONS = [
    { id: 'prasad', name: 'Extra Prasad', price: 101, description: 'Additional prasad for family' },
    { id: 'video', name: 'Video Recording', price: 500, description: 'HD recording of the puja' },
    { id: 'bhoj', name: 'Brahman Bhoj', price: 1100, description: 'Feeding a Brahman on your behalf' },
];

const TIME_SLOTS = [
    { id: 'morning', label: 'Morning', times: ['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM'] },
    { id: 'afternoon', label: 'Afternoon', times: ['12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'] },
    { id: 'evening', label: 'Evening', times: ['05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'] },
];

const PujaBookingForm: React.FC<PujaBookingFormProps> = ({
    isOpen,
    onClose,
    pujaName,
    packageDetails
}) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        poojaType: pujaName,
        date: '',
        time: '',
        gotra: '',
        needSamagri: false,
        specialRequests: '',
    });

    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));

    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [newMember, setNewMember] = useState({ name: '', relation: '' });

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addFamilyMember = () => {
        if (newMember.name) {
            setFamilyMembers([...familyMembers, { ...newMember }]);
            setNewMember({ name: '', relation: '' });
        }
    };

    const removeFamilyMember = (index: number) => {
        setFamilyMembers(familyMembers.filter((_, i) => i !== index));
    };

    const handlePayment = () => {
        // In a real app, this would integrate with Razorpay SDK
        // For now, we'll simulate the redirect
        toast.loading('Redirecting to secure payment gateway...');

        setTimeout(() => {
            window.open('https://razorpay.com/payment-link/pl_link_id', '_blank');
            toast.success('Payment link opened!');
            onClose();
        }, 1500);
    };

    const isStep1Valid = formData.name && formData.phone && formData.date && formData.time;

    const handleNext = () => {
        if (isStep1Valid) {
            setStep(2);
        } else {
            if (!formData.name) {
                toast.error('Please enter your full name');
                return;
            }
            if (!formData.phone) {
                toast.error('Please enter your phone number');
                return;
            }
            if (!formData.date) {
                toast.error('Please select a preferred date');
                return;
            }
            if (!formData.time) {
                toast.error('Please select a preferred time');
                return;
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        {step === 1 ? 'Booking Details' : 'Review & Pay'}
                    </DialogTitle>
                    <DialogDescription>
                        {packageDetails ? `${packageDetails.name} - ₹${packageDetails.price}` : pujaName}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-2">
                    <div className="space-y-6 pb-6">
                        {step === 1 ? (
                            <>
                                {/* Personal Details */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">1</span>
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="gotra">Gotra</Label>
                                            <Input
                                                id="gotra"
                                                value={formData.gotra}
                                                onChange={(e) => handleInputChange('gotra', e.target.value)}
                                                placeholder="e.g., Kashyap"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address (Optional)</Label>
                                        <Textarea
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Enter your full address for prasad delivery"
                                            className="h-20"
                                        />
                                    </div>
                                </div>

                                {/* Puja Details */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">2</span>
                                        Puja Schedule
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label>Preferred Date *</Label>
                                            <div className="flex justify-center border rounded-lg p-2 bg-white">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.date ? new Date(formData.date) : undefined}
                                                    onSelect={(date) => date && handleInputChange('date', format(date, 'yyyy-MM-dd'))}
                                                    disabled={(date) => date < new Date()}
                                                    initialFocus
                                                    className="rounded-md border-0"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3 sm:col-span-2">
                                            <Label>Preferred Time *</Label>
                                            <div className="space-y-4">
                                                {TIME_SLOTS.map((slot) => (
                                                    <div key={slot.id} className="space-y-2">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                            {slot.id === 'morning' && <span className="text-orange-400">🌅</span>}
                                                            {slot.id === 'afternoon' && <span className="text-amber-500">☀️</span>}
                                                            {slot.id === 'evening' && <span className="text-indigo-400">🌙</span>}
                                                            {slot.label}
                                                        </div>
                                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                                            {slot.times.map((time) => (
                                                                <button
                                                                    key={time}
                                                                    onClick={() => handleInputChange('time', time)}
                                                                    className={`text-xs py-2 px-1 rounded-lg border transition-all ${formData.time === time
                                                                        ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                                                                        : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-600'
                                                                        }`}
                                                                >
                                                                    {time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label htmlFor="poojaType">Pooja Type</Label>
                                            <Select
                                                value={formData.poojaType}
                                                onValueChange={(value) => handleInputChange('poojaType', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Puja Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={pujaName}>{pujaName}</SelectItem>
                                                    <SelectItem value="Special Puja">Special Puja</SelectItem>
                                                    <SelectItem value="Custom Ritual">Custom Ritual</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Family Members */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">3</span>
                                        Family Members (Optional)
                                    </h3>

                                    <div className="space-y-3">
                                        {familyMembers.map((member, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                <div className="flex-1 text-sm">
                                                    <span className="font-medium">{member.name}</span>
                                                    {member.relation && <span className="text-slate-500"> ({member.relation})</span>}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeFamilyMember(index)}
                                                    className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}

                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Name"
                                                value={newMember.name}
                                                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                                className="flex-1"
                                            />
                                            <Input
                                                placeholder="Relation"
                                                value={newMember.relation}
                                                onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                                                className="w-1/3"
                                            />
                                            <Button
                                                type="button"
                                                onClick={addFamilyMember}
                                                variant="outline"
                                                size="icon"
                                                className="flex-shrink-0"
                                                disabled={!newMember.name}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Preferences */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">4</span>
                                        Preferences
                                    </h3>

                                    <div className="flex items-center space-x-2 border p-3 rounded-lg border-slate-200">
                                        <Checkbox
                                            id="samagri"
                                            checked={formData.needSamagri}
                                            onCheckedChange={(checked) => handleInputChange('needSamagri', checked)}
                                        />
                                        <Label htmlFor="samagri" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            I need Puja Samagri kit provided by you
                                        </Label>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="special">Special Requests</Label>
                                        <Textarea
                                            id="special"
                                            value={formData.specialRequests}
                                            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                                            placeholder="Any specific requirements or concerns..."
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-orange-900">{packageDetails?.name || 'Selected Package'}</h4>
                                            <p className="text-sm text-orange-700">{formData.poojaType}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-orange-900">₹{packageDetails?.price || 0}</p>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-orange-200/50 text-sm text-orange-800 space-y-1">
                                        <p><span className="font-medium">Date:</span> {formData.date} at {formData.time}</p>
                                        <p><span className="font-medium">For:</span> {formData.name} {familyMembers.length > 0 && `+ ${familyMembers.length} others`}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-medium text-slate-900">Optional Add-ons</h4>
                                    <div className="space-y-2">
                                        {ADDONS.map((addon) => {
                                            const isSelected = selectedAddons.includes(addon.id);
                                            return (
                                                <div
                                                    key={addon.id}
                                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-orange-500 bg-orange-50/50' : 'border-slate-200 hover:border-orange-200'
                                                        }`}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedAddons(selectedAddons.filter(id => id !== addon.id));
                                                        } else {
                                                            setSelectedAddons([...selectedAddons, addon.id]);
                                                        }
                                                    }}
                                                >
                                                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'
                                                        }`}>
                                                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-medium text-sm text-slate-900">{addon.name}</span>
                                                            <span className="font-semibold text-sm text-orange-700">+₹{addon.price}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-0.5">{addon.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-medium text-slate-900">Payment Summary</h4>
                                    <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Base Amount</span>
                                            <span className="font-medium">₹{packageDetails?.price || 0}</span>
                                        </div>
                                        {formData.needSamagri && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Samagri Kit</span>
                                                <span className="font-medium">₹501</span>
                                            </div>
                                        )}
                                        {selectedAddons.map(addonId => {
                                            const addon = ADDONS.find(a => a.id === addonId);
                                            return addon ? (
                                                <div key={addon.id} className="flex justify-between text-orange-700">
                                                    <span>{addon.name}</span>
                                                    <span>₹{addon.price}</span>
                                                </div>
                                            ) : null;
                                        })}
                                        <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                                            <span>Total Payable</span>
                                            <span>₹{(packageDetails?.price || 0) + (formData.needSamagri ? 501 : 0) + selectedAddons.reduce((acc, id) => acc + (ADDONS.find(a => a.id === id)?.price || 0), 0)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start">
                                    <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium mb-1">Secure Payment</p>
                                        <p className="opacity-90">Your payment is processed securely via Razorpay. All transactions are encrypted.</p>
                                    </div>
                                </div>

                                <div className="bg-red-50 p-4 rounded-lg flex gap-3 items-start border border-red-100">
                                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-red-800">
                                        <p className="font-medium mb-1">No Refund Policy</p>
                                        <p className="opacity-90">Please note that payments once made are non-refundable. Rescheduling is allowed up to 24 hours before the puja.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2 border-t bg-white z-10">
                    <div className="flex gap-3 w-full">
                        {step === 2 && (
                            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                Back
                            </Button>
                        )}
                        <Button
                            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                            onClick={() => step === 1 ? handleNext() : handlePayment()}
                        >
                            {step === 1 ? 'Proceed to Pay' : 'Pay Now'}
                            {step === 2 && <CreditCard className="ml-2 h-4 w-4" />}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent >
        </Dialog >
    );
};

export default PujaBookingForm;
