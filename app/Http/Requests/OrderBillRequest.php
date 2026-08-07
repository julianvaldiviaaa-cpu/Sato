<?php

namespace App\Http\Requests;

use App\Enums\OrderPaymentMethod;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderBillRequest extends FormRequest
{
    public function authorize(): bool
    {
        $order = $this->route('order');

        return $order !== null
            && $this->user()?->can('requestBill', $order);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'payment_method' => ['required', Rule::enum(OrderPaymentMethod::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'payment_method.required' => 'Debes elegir un método de pago.',
            'payment_method.enum' => 'El método de pago no es válido.',
        ];
    }
}
