import { Button } from '@heroui/react';
import { router } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { route } from 'ziggy-js';
import CategoryForm from '@/Components/CategoryForm';
import FormLayout from '@/pages/Layouts/FormLayout';
import type { Category } from '@/types';

type Props = {
    category: Category;
};

export default function CategoryEdit({ category }: Props) {
    return (
        <FormLayout>
            <Button
                onClick={() => router.get(route('categories.show', category))}
                className="mb-6 flex items-center justify-center border-2 border-orange-500 bg-transparent text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-orange-100"
            >
                <ChevronLeft /> Volver
            </Button>
            <CategoryForm categoy={category} />
        </FormLayout>
    );
}
