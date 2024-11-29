<?php

namespace App\Models\Services;

interface BannedTopicsDetectorInterface
{
    public function isAllowed(string $content): bool;
}
