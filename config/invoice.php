<?php

return [

    'business_name' => env('INVOICE_BUSINESS_NAME', 'Sato Restaurante S.A. de C.V.'),

    'rfc' => env('INVOICE_RFC', 'SAT010101XXX'),

    'address' => env('INVOICE_ADDRESS', 'Av. Principal 123, Col. Centro, Ciudad de México, CDMX, México'),

    'regime' => env('INVOICE_REGIME', 'Régimen General de Ley Personas Morales'),

    'folio_prefix' => env('INVOICE_FOLIO_PREFIX', 'F'),

    'currency' => env('INVOICE_CURRENCY', 'MXN'),
];
