"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useCommentFilter } from "@/hooks/use-comment-filter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Filter,
  Flame,
  TrendingUp,
  Zap,
  Clock,
  MessageCircle,
} from "lucide-react";

type Props = {
  commentCount?: number;
};

const filterOptions = [
  {
    value: "all" as const,
    label: "All Comments",
    icon: MessageCircle,
    description: "Show all comments",
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
  },
  {
    value: "hot" as const,
    label: "Hot",
    icon: Flame,
    description: "Most active discussions",
    color: "bg-orange-500/10 text-orange-600 border-orange-200",
  },
  {
    value: "top" as const,
    label: "Top",
    icon: TrendingUp,
    description: "Highest rated comments",
    color: "bg-green-500/10 text-green-600 border-green-200",
  },
  {
    value: "controversial" as const,
    label: "Controversial",
    icon: Zap,
    description: "Most debated comments",
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
  },
  {
    value: "new" as const,
    label: "New",
    icon: Clock,
    description: "Recently added comments",
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  },
];

export default function CommentFilter({ commentCount = 0 }: Props) {
  const { filter, setFilter } = useCommentFilter();

  return (
    <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Sort Comments
          </CardTitle>

          <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {commentCount} comments
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {filterOptions.map((option) => {
            const Icon = option.icon;

            const isActive = filter === option.value;

            return (
              <Button
                key={option.value}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(option.value)}
                className={`
                  h-auto p-3 flex flex-col items-center gap-2 transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "hover:scale-102 hover:shadow-sm"
                  }
                `}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                />
                <div className="text-center">
                  <div className="text-xs font-medium leading-tight">
                    {option.label}
                  </div>

                  <div className="text-xs text-muted-foreground/70 leading-tight mt-1">
                    {option.description}
                  </div>
                </div>

                {isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                )}
              </Button>
            );
          })}
        </div>

        <div className="border-t border-border my-4" />

        {/* Active Filter Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Currently showing:
            </span>

            <div
              className={`
              text-xs px-2 py-1 rounded-full border
              ${filterOptions.find((opt) => opt.value === filter)?.color}
            `}
            >
              {filterOptions.find((opt) => opt.value === filter)?.label}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />

              <span>{commentCount} total</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
