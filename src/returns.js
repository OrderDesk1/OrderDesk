// Returns handling for OrderDesk.
//
// A return covers one or more lines of an order. A refund against it must be
// approved by a refunds clerk before any money moves.

/**
 * Open a return request against an order.
 *
 * @param {object} order  the order being returned against
 * @param {Array}  lines  the order lines the customer is sending back
 * @returns {object} the new return request
 */
function openReturn(order, lines) {
  if (lines.length === 0) {
    throw new Error('a return must cover at least one line');
  }

  const returnableLines = lines.filter((line) => !line.finalClearance);
  if (returnableLines.length === 0) {
    throw new Error('a return cannot be opened for final-clearance items');
  }

  // A return can only be opened within 30 days of delivery. Resolved by
  // keeping both guards from story A and story B: an order with no
  // deliveredAt yet has no window to measure, so it stays allowed.
  if (order.deliveredAt) {
    const deliveredDate = new Date(order.deliveredAt);
    const diffInDays = (Date.now() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffInDays > 30) {
      throw new Error('a return cannot be opened more than 30 days after delivery');
    }
  }

  return {
    orderId: order.id,
    lines: returnableLines,
    raisedAt: new Date().toISOString(),
    approvedBy: null,
    approvedAt: null,
  };
}

function approve(returnRequest, clerkId, reason) {
  if (!reason) {
    throw new Error('a refund approval must carry a reason');
  }

  return {
    ...returnRequest,
    approvedBy: clerkId,
    approvedAt: new Date().toISOString(),
    reason,
  };
}

module.exports = { openReturn, approve };
