<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IndexArticleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'page' => ['nullable', 'integer', 'min:1'],
            'perPage' => ['nullable', 'integer', 'min:1', 'max:100'],
            'sort' => ['nullable', 'array'],
            'sort.*' => ['string'],
            'filter' => ['nullable', 'array'],
            'filter.authorId' => ['nullable', 'integer'],
            'filter.createdSinceDate' => ['nullable', 'date'],
            'search' => ['nullable', 'string', 'max:255'],
            'tag' => ['nullable', 'string'],
        ];
    }
}
