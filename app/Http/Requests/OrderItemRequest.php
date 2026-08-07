<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        $order = $this->route('order');

        return $order !== null
            && $this->user()?->can('addItems', $order);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.saucer_id' => [
                'required',
                'integer',
                Rule::exists('saucers', 'id')->where('available', true),
            ],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Debes agregar al menos un platillo a la orden.',
            'items.*.saucer_id.exists' => 'El platillo seleccionado no existe.',
            'items.*.quantity.min' => 'La cantidad debe ser de al menos 1.',
        ];
    }
}
