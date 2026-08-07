<?php

namespace App\Http\Requests;

use App\Enums\OrderItemStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderItemStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        $orderItem = $this->route('orderItem');

        return $orderItem !== null
            && $this->user()?->can('updateStatus', $orderItem);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(OrderItemStatus::class)],
        ];
    }
}
