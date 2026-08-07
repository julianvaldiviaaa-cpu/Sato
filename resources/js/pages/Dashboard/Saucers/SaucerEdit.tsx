import { Button } from '@heroui/react';
import { router } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { route } from 'ziggy-js';
import SaucerForm from '@/Components/SaucerForm';
import FormLayout from '@/pages/Layouts/FormLayout';
import type { Category, Saucer } from '@/types';

type Props = {
    category: Category;
    saucer: Saucer;
};
export default function SaucerEdit({ category, saucer }: Props) {
    return (
        <FormLayout>
            <Button
                onClick={() =>
                    router.get(route('saucers.manage', { category, saucer }))
                }
                className="mb-6 flex items-center justify-center border-2 border-orange-500 bg-transparent text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-orange-100"
            >
                <ChevronLeft /> Volver
            </Button>
            <SaucerForm category={category} saucer={saucer} />
        </FormLayout>
    );
}
