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

  // Require a first delivery before checking item eligibility.
  // This preserves both the delivery and final-clearance rules.
  if (order.deliveredAt === null) {
    throw new Error(
        'Cannot return an order before delivery. Consider cancelling instead.'
    );
  }

  const returnableLines = lines.filter((line) => !line.finalClearance);

  if (returnableLines.length === 0) {
    throw new Error('a return cannot be opened for final-clearance items');
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
  // Kiểm tra lý do bắt buộc và không được chuỗi rông/khoảng trắng
  if (!reason || typeof reason !== 'string' || reason.trim() === '') {
    throw new Error('a refund approval must carry a reason');
  }

  //Kiểm tra từ chối phê duyệt lại đơn đã được duyệt trước đó
  if (returnRequest.approvedBy != null) {
    throw new Error('this return request has already been approved');
  }

  return {
    ...returnRequest,
    approvedBy: clerkId,
    approvedAt: new Date().toISOString(),
    reason,
  };
}

module.exports = { openReturn, approve };
