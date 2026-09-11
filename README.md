# OrderDesk
Lab3
// test rule

## ODK-178 — Returns before first delivery

### Rule

An order with `deliveredAt: null` must be refused by `openReturn`.
The refusal must be a thrown error suggesting cancellation instead.

An order with a delivery timestamp keeps its existing return behavior.
Partial delivery is sufficient; not all shipments need to be delivered.

### Manual verification

Use otherwise valid order data and a non-empty return line list
for cases 1–3. Call `openReturn` using the existing project interface.

1. Not delivered:
   - Set `order.deliveredAt` to `null`.
   - Attempt to open a return.
   - Expected: an error is thrown and suggests cancelling instead.

2. Delivered:
   - Use a valid delivered order with an ISO-8601 `deliveredAt`.
   - Attempt to open a return.
   - Expected: the existing return behavior is preserved.

3. Partly delivered:
   - Use an order with a valid `deliveredAt` and some shipments
     still outstanding.
   - Attempt to open a return.
   - Expected: the new delivery guard does not reject the return.

4. Empty return line list:
   - Use an otherwise valid delivered order.
   - Attempt to open a return with an empty line list.
   - Expected: the existing empty-line error is still thrown.

### Product owner question

Cancellation closes at first dispatch, while returns require a first
delivery. Between dispatch and delivery, an order may qualify for
neither cancellation nor return.

The cancellation suggestion does not guarantee cancellation eligibility.
The product owner needs to clarify how this gap should be handled.
ODK-178 does not change the cancellation rule.