import type React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UserTablePaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalUsers: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

export const UserTablePagination: React.FC<UserTablePaginationProps> = ({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalUsers,
  goToPreviousPage,
  goToNextPage,
}) => {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        {totalUsers === 0
          ? "No users found"
          : `${startIndex + 1}-${Math.min(endIndex, totalUsers)} of ${totalUsers}`}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousPage}
          disabled={currentPage === 1 || totalUsers === 0} // ✅ Prevents navigating if no users
        >
          <span className="sr-only">Previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextPage}
          disabled={currentPage === totalPages || totalUsers === 0} // ✅ Prevents navigating if no users
        >
          <span className="sr-only">Next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
