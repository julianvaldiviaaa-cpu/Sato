import { Button } from '@heroui/react';
import { router } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { route } from 'ziggy-js';
import SaucerForm from '@/Components/SaucerForm';
import FormLayout from '@/pages/Layouts/FormLayout';
import type { Category } from '@/types';

type Props = {
    category: Category;
};

export default function SaucerCreate({ category }: Props) {
    return (
        <FormLayout>
            <Button
                onClick={() => router.get(route('categories.show', category))}
                className="mb-4 border-2 border-orange-500 bg-transparent px-6 text-xl tracking-tight text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-orange-100"
            >
                <ChevronLeft /> Volver a {category.name}
            </Button>
            <SaucerForm category={category} />
        </FormLayout>
    );
}
