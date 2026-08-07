import { Button } from '@heroui/react';
import { router } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { route } from 'ziggy-js';
import IngredientForm from '@/Components/IngredientForm';
import FormLayout from '@/pages/Layouts/FormLayout';
import type { Ingredient } from '@/types';

type Props = {
    ingredient: Ingredient;
};
export default function IngredientEdit({ ingredient }: Props) {
    return (
        <FormLayout>
            <Button
                onClick={() => router.get(route('ingredients'))}
                className="mb-6 flex items-center justify-center border-2 border-orange-500 bg-transparent text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-orange-100"
            >
                <ChevronLeft /> Volver
            </Button>
            <IngredientForm ingredient={ingredient} />
        </FormLayout>
    );
}
