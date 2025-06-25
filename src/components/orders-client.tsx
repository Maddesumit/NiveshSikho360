"use client";

import { useNiveshStore } from "@/hooks/use-trade-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ListOrdered } from "lucide-react";
import { format } from "date-fns";

export default function OrdersClient() {
  const { state } = useNiveshStore();
  const { orders } = state;

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col items-start space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <ListOrdered className="w-8 h-8" />
          Order History
        </h1>
        <p className="text-muted-foreground">
          A record of all your buy and sell transactions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>
            You have placed {orders.length} orders in total.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const isBuy = order.type === "BUY";
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">
                          {format(new Date(order.timestamp), "dd MMM yyyy")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(order.timestamp), "p")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.stock.symbol}</div>
                        <div className="text-sm text-muted-foreground hidden md:block">
                          {order.stock.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isBuy ? "default" : "destructive"}
                          className={cn(
                            isBuy
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          )}
                        >
                          {order.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(order.price)}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(order.price * order.quantity)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-medium">No orders yet.</p>
              <p>Your trade history will appear here once you buy or sell stocks.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
