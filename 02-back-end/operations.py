import piheaan as heaan
from piheaan.math import approx

def compute_sigmoid(ctxt_X, ctxt_beta, n, log_slots, eval, context, num_slots):
    '''
    ctxt_X : data for evaluation
    ctxt_beta : estimated beta from function 'step'
    n : the number of row in test_data
    '''
    ctxt_rot = heaan.Ciphertext(context)
    ctxt_tmp = heaan.Ciphertext(context)

    # beta0
    ctxt_beta0 = heaan.Ciphertext(context)
    eval.left_rotate(ctxt_beta, 15*n, ctxt_beta0)

    # compute x * beta + beta0
    ctxt_tmp = heaan.Ciphertext(context)
    eval.mult(ctxt_beta, ctxt_X, ctxt_tmp)

    for i in range(3):
        eval.left_rotate(ctxt_tmp, n*2**(2-i), ctxt_rot)
        eval.add(ctxt_tmp, ctxt_rot, ctxt_tmp)
    eval.add(ctxt_tmp, ctxt_beta0, ctxt_tmp)

    msg_mask = heaan.Message(log_slots)
    for i in range(n):
        msg_mask[i] = 1
    eval.mult(ctxt_tmp, msg_mask, ctxt_tmp)

    # compute sigmoid
    approx.sigmoid(eval, ctxt_tmp, ctxt_tmp, 8.0)
    eval.bootstrap(ctxt_tmp, ctxt_tmp)
    msg_mask = heaan.Message(log_slots)
    for i in range(n, num_slots):
        msg_mask[i] = 0.5
    eval.sub(ctxt_tmp, msg_mask, ctxt_tmp)

    return ctxt_tmp