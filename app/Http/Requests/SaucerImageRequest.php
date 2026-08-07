<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaucerImageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120', // 5 MB
            ],
        ];
    }
}
