import React, { useState } from "react";
import { Card, PageHeader } from "../components/ui";
import { NOTIFICATIONS as INITIAL } from "../lib/data";

export default function Notifications() {
  const [items, setItems] = useState(INITIAL);
  const unread = items.filter((n) => n.unread).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  const markRead = (id) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <div>
      <PageHeader title="Notifications" />

      <div className="flex items-center justify-between mb-5">
        <p className="text-[12px]" style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 600 }}>
          {unread > 0 ? `${unread} unread` : "You're all caught up"}
        </p>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-[11.5px]"
            style={{ color: "#0E4B43", fontFamily: "Manrope", fontWeight: 700 }}
          >
            Mark all as read
          </button>
        )}
      </div>

      <Card className="divide-y" style={{ borderColor: "#E5DFD0" }}>
        {items.map((n) => {
          const Icon = n.icon;
          return (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className="w-full text-left flex items-start gap-3 px-4 py-4"
              style={{ borderTop: "1px solid #EFEBE0", background: n.unread ? "#FBFAF6" : "transparent" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: n.color + "1A" }}
              >
                <Icon size={16} color={n.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] flex-1" style={{ color: "#14231F", fontFamily: "Manrope", fontWeight: 700 }}>
                    {n.title}
                  </p>
                  {n.unread && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#E8604C" }} />}
                </div>
                <p className="text-[12px] mt-1 leading-snug" style={{ color: "#5C6B64", fontFamily: "Manrope", fontWeight: 500 }}>
                  {n.body}
                </p>
                <p className="text-[10.5px] mt-1.5" style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 600 }}>
                  {n.time}
                </p>
              </div>
            </button>
          );
        })}
      </Card>
    </div>
  );
}
