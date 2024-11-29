<?php

namespace App\Models\Services;

class CompositeBannedTopicsDetector implements BannedTopicsDetectorInterface
{
    public function __construct(
        private HardcodedListBannedTopicsDetector $hardcodedListBannedTopicsDetector,
        private SuperAIBannedTopicsDetector $superAIBannedTopicsDetector
    ) {}

    public function isAllowed(string $content): bool
    {
        // Combine all other detectors into one

        return false;
    }
}
