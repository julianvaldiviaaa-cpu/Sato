import { Button } from '@heroui/react';
import { router } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { route } from 'ziggy-js';
import IngredientForm from '@/Components/IngredientForm';
import FormLayout from '@/pages/Layouts/FormLayout';

export default function IngredientCreate() {
    return (
        <FormLayout>
            <Button
                onClick={() => router.get(route('ingredients'))}
                className="mb-4 border-2 border-orange-500 bg-transparent px-6 text-xl tracking-tight text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-orange-100"
            >
                <ChevronLeft /> Volver
            </Button>
            <IngredientForm />
        </FormLayout>
    );
}
