<?php

/**
 * This file contains helper definitions to workaround quirks and features of PHP static type analyzers.
 *
 * It can be ignored.
 */

namespace Illuminate\Contracts\Pagination {
    class LengthAwarePaginator
    {
        public function withQueryString(): self
        {
            return $this;
        }
    }
}
